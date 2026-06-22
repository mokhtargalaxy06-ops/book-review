<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'genre' => ['nullable', 'string', 'max:100'],
            'year' => ['nullable', 'integer', 'min:1000', 'max:'.now()->year],
            'rating' => ['nullable', 'numeric', 'between:1,5'],
            'featured' => ['nullable', 'boolean'],
            'sort' => ['nullable', 'in:newest,title,rating'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'between:1,24'],
        ]);

        $books = Book::query()
            ->withCount('reviews')
            ->withAvg('reviews', 'rating')
            ->when($validated['search'] ?? null, function (Builder $query, string $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('genre', 'like', "%{$search}%");
                });
            })
            ->when($validated['genre'] ?? null, fn (Builder $query, string $genre) => $query->where('genre', $genre))
            ->when($validated['year'] ?? null, fn (Builder $query, int $year) => $query->where('published_year', $year))
            ->when(
                $validated['rating'] ?? null,
                fn (Builder $query, float $rating) => $query->having('reviews_avg_rating', '>=', $rating)
            )
            ->when(
                array_key_exists('featured', $validated),
                fn (Builder $query) => $query->where('is_featured', $validated['featured'])
            );

        match ($validated['sort'] ?? 'newest') {
            'title' => $books->orderBy('title'),
            'rating' => $books->orderByDesc('reviews_avg_rating'),
            default => $books->latest(),
        };

        return BookResource::collection(
            $books->paginate($validated['per_page'] ?? 12)->withQueryString()
        );
    }

    public function store(StoreBookRequest $request): JsonResponse
    {
        $this->authorize('create', Book::class);
        $data = $request->safe()->except('cover');
        $data['created_by'] = $request->user()->id;

        if ($request->hasFile('cover')) {
            $data['cover_path'] = $request->file('cover')->store('book-covers', 'public');
        }

        $book = Book::create($data)->loadCount('reviews')->loadAvg('reviews', 'rating');

        return (new BookResource($book))->response()->setStatusCode(201);
    }

    public function show(Book $book): BookResource
    {
        $book->load([
            'creator',
            'reviews' => fn ($query) => $query->with('user')->latest(),
        ])->loadCount('reviews')->loadAvg('reviews', 'rating');

        return new BookResource($book);
    }

    public function update(UpdateBookRequest $request, Book $book): BookResource
    {
        $data = $request->safe()->except(['cover', 'remove_cover']);

        if ($request->boolean('remove_cover') && $book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
            $data['cover_path'] = null;
        }

        if ($request->hasFile('cover')) {
            if ($book->cover_path) {
                Storage::disk('public')->delete($book->cover_path);
            }
            $data['cover_path'] = $request->file('cover')->store('book-covers', 'public');
        }

        $book->update($data);

        return new BookResource($book->fresh()->loadCount('reviews')->loadAvg('reviews', 'rating'));
    }

    public function destroy(Book $book): JsonResponse
    {
        $this->authorize('delete', $book);

        if ($book->cover_path) {
            Storage::disk('public')->delete($book->cover_path);
        }

        $book->delete();

        return response()->json(null, 204);
    }

    public function genres(): JsonResponse
    {
        return response()->json([
            'data' => Book::query()->distinct()->orderBy('genre')->pluck('genre'),
        ]);
    }
}

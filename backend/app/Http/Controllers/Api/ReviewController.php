<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Book;
use App\Models\Review;
use Illuminate\Http\JsonResponse;

class ReviewController extends Controller
{
    public function store(StoreReviewRequest $request, Book $book): JsonResponse
    {
        $review = $book->reviews()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return (new ReviewResource($review->load('user')))->response()->setStatusCode(201);
    }

    public function update(UpdateReviewRequest $request, Review $review): ReviewResource
    {
        $review->update($request->validated());

        return new ReviewResource($review->fresh()->load('user'));
    }

    public function destroy(Review $review): JsonResponse
    {
        $this->authorize('delete', $review);
        $review->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BookResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'author' => $this->author,
            'isbn' => $this->isbn,
            'description' => $this->description,
            'cover_url' => $this->cover_path ? url(Storage::url($this->cover_path)) : null,
            'genre' => $this->genre,
            'published_year' => $this->published_year,
            'is_featured' => $this->is_featured,
            'average_rating' => round((float) ($this->reviews_avg_rating ?? 0), 1),
            'reviews_count' => (int) ($this->reviews_count ?? 0),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'can_edit' => $request->user()?->can('update', $this->resource) ?? false,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

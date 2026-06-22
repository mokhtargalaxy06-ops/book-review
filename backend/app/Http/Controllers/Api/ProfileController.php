<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function update(UpdateProfileRequest $request): UserResource
    {
        $request->user()->update($request->validated());

        return new UserResource($request->user()->fresh());
    }

    public function reviews(Request $request)
    {
        $reviews = $request->user()
            ->reviews()
            ->with([
                'user',
                'book' => fn ($query) => $query->withCount('reviews')->withAvg('reviews', 'rating'),
            ])
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }
}

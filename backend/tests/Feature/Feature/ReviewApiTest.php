<?php

namespace Tests\Feature\Feature;

use App\Models\Book;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_review_a_book_once(): void
    {
        $user = User::factory()->create();
        $book = Book::factory()->create();

        $payload = [
            'rating' => 5,
            'body' => 'Beautifully written and unusually generous with its characters.',
        ];

        $this->actingAs($user)
            ->postJson("/api/books/{$book->id}/reviews", $payload)
            ->assertCreated()
            ->assertJsonPath('data.rating', 5);

        $this->actingAs($user)
            ->postJson("/api/books/{$book->id}/reviews", $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors('book_id');
    }

    public function test_review_owners_can_edit_and_delete_their_reviews(): void
    {
        $review = Review::factory()->create();

        $this->actingAs($review->user)
            ->patchJson("/api/reviews/{$review->id}", [
                'rating' => 4,
                'body' => 'Still excellent, with a slightly slower middle than I remembered.',
            ])
            ->assertOk()
            ->assertJsonPath('data.rating', 4);

        $this->actingAs($review->user)
            ->deleteJson("/api/reviews/{$review->id}")
            ->assertNoContent();
    }

    public function test_other_users_cannot_edit_a_review(): void
    {
        $review = Review::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patchJson("/api/reviews/{$review->id}", ['rating' => 1])
            ->assertForbidden();
    }
}

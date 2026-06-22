<?php

namespace Tests\Feature\Feature;

use App\Models\Book;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_books_can_be_searched_and_filtered_publicly(): void
    {
        Book::factory()->create([
            'title' => 'The Quiet Archive',
            'author' => 'Mira Stone',
            'genre' => 'Fantasy',
        ]);
        Book::factory()->create(['title' => 'Different Book', 'genre' => 'Mystery']);

        $this->getJson('/api/books?search=Archive&genre=Fantasy')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'The Quiet Archive');
    }

    public function test_an_authenticated_user_can_create_and_update_their_book(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/books', [
            'title' => 'A Map of Small Things',
            'author' => 'Nora Vale',
            'isbn' => '9781234567890',
            'description' => 'A thoughtful book about noticing the details that shape a life.',
            'genre' => 'Literary Fiction',
            'published_year' => 2024,
        ])->assertCreated();

        $bookId = $response->json('data.id');

        $this->actingAs($user)
            ->patchJson("/api/books/{$bookId}", ['title' => 'A Better Map'])
            ->assertOk()
            ->assertJsonPath('data.title', 'A Better Map');
    }

    public function test_a_user_cannot_change_another_users_book(): void
    {
        $book = Book::factory()->create();

        $this->actingAs(User::factory()->create())
            ->patchJson("/api/books/{$book->id}", ['title' => 'Stolen Title'])
            ->assertForbidden();
    }
}

<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Book>
 */
class BookFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'created_by' => User::factory(),
            'title' => fake()->unique()->sentence(fake()->numberBetween(2, 5)),
            'author' => fake()->name(),
            'isbn' => fake()->unique()->isbn13(),
            'description' => fake()->paragraphs(fake()->numberBetween(2, 5), true),
            'cover_path' => null,
            'genre' => fake()->randomElement([
                'Classics',
                'Fantasy',
                'Historical Fiction',
                'Mystery',
                'Nonfiction',
                'Romance',
                'Science Fiction',
                'Thriller',
            ]),
            'published_year' => fake()->numberBetween(1950, now()->year),
            'is_featured' => fake()->boolean(25),
        ];
    }
}

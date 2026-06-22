<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $books = Book::all();

        User::query()->get()->each(function (User $user) use ($books) {
            $books->random(min(8, $books->count()))->each(function (Book $book) use ($user) {
                Review::factory()->create([
                    'user_id' => $user->id,
                    'book_id' => $book->id,
                ]);
            });
        });
    }
}

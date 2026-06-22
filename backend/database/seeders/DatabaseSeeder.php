<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Demo Reader',
            'email' => 'demo@example.com',
            'password' => 'password123',
        ]);

        User::factory(11)->create();

        $this->call([
            BookSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}

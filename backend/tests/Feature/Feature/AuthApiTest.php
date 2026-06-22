<?php

namespace Tests\Feature\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_user_can_register_and_receive_a_stateful_session(): void
    {
        $response = $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/register', [
            'name' => 'Alice Reader',
            'email' => 'alice@gmail.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'alice@gmail.com');
        $this->assertAuthenticated();
    }

    public function test_a_user_can_login_and_logout(): void
    {
        $user = User::factory()->create(['password' => 'secret123']);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'secret123',
            'remember' => true,
        ])->assertOk();

        $this->assertAuthenticatedAs($user);

        $this->withHeader('Origin', 'http://localhost:5173')->postJson('/api/logout')->assertOk();
        $this->withHeader('Origin', 'http://localhost:5173')->getJson('/api/profile')->assertUnauthorized();
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        User::factory()->create(['email' => 'reader@gmail.com']);

        $this->postJson('/api/login', [
            'email' => 'reader@gmail.com',
            'password' => 'wrong-password',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }
}

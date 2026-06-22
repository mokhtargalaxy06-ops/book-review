<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('update', $this->route('book')) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'author' => ['sometimes', 'required', 'string', 'max:255'],
            'isbn' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                Rule::unique('books', 'isbn')->ignore($this->route('book')),
            ],
            'description' => ['sometimes', 'required', 'string', 'min:20', 'max:10000'],
            'cover' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_cover' => ['sometimes', 'boolean'],
            'genre' => ['sometimes', 'required', 'string', 'max:100'],
            'published_year' => ['nullable', 'integer', 'min:1000', 'max:'.now()->year],
            'is_featured' => ['sometimes', 'boolean'],
        ];
    }
}

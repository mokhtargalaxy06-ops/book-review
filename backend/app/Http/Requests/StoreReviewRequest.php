<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'between:1,5'],
            'body' => ['required', 'string', 'min:10', 'max:5000'],
            'book_id' => [
                Rule::unique('reviews')->where(
                    fn ($query) => $query
                        ->where('user_id', $this->user()->id)
                        ->where('book_id', $this->route('book')->id)
                ),
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['book_id' => $this->route('book')?->id]);
    }

    public function messages(): array
    {
        return [
            'book_id.unique' => 'You have already reviewed this book.',
        ];
    }
}

<?php

namespace App\Http\Controllers;
use App\Http\Requests\StoreProductRequest;
use Illuminate\Http\Request;
use App\Models\Product;
class ProductController extends Controller
{



    public function ProductImages(Request $request){

        $prodId= Product::find($request->id);
        $prodImages= Product::where('images_product',$prodId)->get();

        return response()->json($prodImages);
    }
    public function index()
    {

        $products = Product::orderBy('created_at', 'desc')->get();
        return response()->json($products);
    }

    public function store(StoreProductRequest $request)
    {

        return Product::create($request->validated());
    }


public function byCategory($categoryId)
{
    $products = Product::where('category_id', $categoryId)->get();
    return response()->json($products);
}
    public function show($id)
{
    $product = Product::findOrFail($id);
    return response()->json($product);
}
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $product->update($request->all());
        return $product;
    }
    public function destroy($id)
    {
        Product::destroy($id);
        return response()->json();
    }


}
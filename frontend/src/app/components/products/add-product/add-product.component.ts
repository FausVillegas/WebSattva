// import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
// import { first } from 'rxjs';
// import { Product } from 'src/app/models/Product';
// import { AuthService } from 'src/app/services/auth.service';
// import { ProductService } from 'src/app/services/product.service';
// import { put } from '@vercel/blob';

// @Component({
//   selector: 'app-add-product',
//   templateUrl: './add-product.component.html',
//   styleUrls: ['./add-product.component.css']
// })
// export class AddProductComponent implements OnInit{
//   @ViewChild("formDirective") formDirective!: NgForm;
//   categories: string[] = ['Ejercicio', 'Meditación', 'Decoración'];

//   productForm: FormGroup;
//   selectedImage: File | undefined;

//   constructor(private authService: AuthService, private productService: ProductService) {
//     this.productForm = this.createFormGroup();
//   }

//   ngOnInit(): void {
//   }

//   createFormGroup(): FormGroup {
//     return new FormGroup({
//       title: new FormControl("", [Validators.required]),
//       description: new FormControl("", [Validators.required]),
//       sale_price: new FormControl("", [Validators.required]),
//       category: new FormControl("", [Validators.required]),
//       stock: new FormControl("", [Validators.required]),
//       image_url: new FormControl(null, [Validators.required]),
//     });
//  }

//   onFileChange(event: any): void {
//     if (event.target.files.length > 0) {
//       this.selectedImage = event.target.files[0];
//     }
//   }

//  onSubmit(): void {
//   if (this.productForm.get('sale_price')?.value < 0 || this.productForm.get('stock')?.value < 0) {
//     alert("Valor negativo no permitido.");
//     return;
//   }
//   if (!this.selectedImage) {
//     alert("Debes seleccionar una imagen.");
//     return;
//   }
//   if (this.productForm.valid) {
//     const formData = new FormData();
//     formData.append('title', this.productForm.get('title')?.value);
//     formData.append('description', this.productForm.get('description')?.value);
//     formData.append('sale_price', this.productForm.get('sale_price')?.value);
//     formData.append('category', this.productForm.get('category')?.value);
//     formData.append('stock', this.productForm.get('stock')?.value);
//     formData.append('user', this.productForm.get('user')?.value);
//     formData.append('image_url', this.selectedImage);

//     this.productService.createProduct(formData).subscribe({
//       next: (response) => {
//         console.log('Product created successfully', response);
//         this.productForm.reset();
//         this.formDirective.resetForm();
//       },
//       error: (error) => {
//         console.error('Error creating product', error);
//       }
//     });    
//   } else {
//     console.log("The product form is not valid");
//   }
// }

// }

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { put } from '@vercel/blob';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  @ViewChild("formDirective") formDirective!: NgForm;
  categories: string[] = ['Ejercicio', 'Meditación', 'Decoración'];
  productForm: FormGroup;
  selectedImage: File | undefined;

  constructor(private productService: ProductService) {
    this.productForm = this.createFormGroup();
  }

  ngOnInit(): void {}

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      sale_price: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      stock: new FormControl("", [Validators.required]),
      image_url: new FormControl(null, [Validators.required]),
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  async uploadImage(): Promise<string | undefined> {
    if (this.selectedImage) {
      try {
        const { url } = await put('images', this.selectedImage, { access: 'public' });
        console.log('Image URL:', url);
        return url;
      } catch (error) {
        console.error('Error uploading image', error);
      }
    }
    return undefined;
  }

  async onSubmit(): Promise<void> {
    if (this.productForm.get('sale_price')?.value < 0 || this.productForm.get('stock')?.value < 0) {
      alert("Valor negativo no permitido.");
      return;
    }

    if (!this.selectedImage) {
      alert("Debes seleccionar una imagen.");
      return;
    }

    if (this.productForm.valid) {
      const imageUrl = await this.uploadImage();  // Wait for image upload
      if (imageUrl) {
        const formData = new FormData();
        formData.append('title', this.productForm.get('title')?.value);
        formData.append('description', this.productForm.get('description')?.value);
        formData.append('sale_price', this.productForm.get('sale_price')?.value);
        formData.append('category', this.productForm.get('category')?.value);
        formData.append('stock', this.productForm.get('stock')?.value);
        formData.append('image_url', imageUrl);  // Use uploaded image URL

        this.productService.createProduct(formData).subscribe({
          next: (response) => {
            console.log('Product created successfully', response);
            this.productForm.reset();
            this.formDirective.resetForm();
          },
          error: (error) => {
            console.error('Error creating product', error);
          }
        });
      } else {
        console.log("Image upload failed, product creation aborted.");
      }
    } else {
      console.log("The product form is not valid");
    }
  }
}

import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit{
  @ViewChild("formDirective") formDirective!: NgForm;
  productForm: FormGroup;
  selectedFile: File | null = null;
  @Output() create: EventEmitter<any> = new EventEmitter;

  isOpen = false;

  constructor(private authService: AuthService, private productService: ProductService) {
    this.productForm = this.createFormGroup();
  }

  ngOnInit(): void {
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [Validators.required, Validators.minLength(4)]),
      description: new FormControl("", [Validators.required, Validators.minLength(5)]),
      price: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required, Validators.minLength(3)]),
      stock: new FormControl("", [Validators.required]),
      image: new FormControl("", [Validators.required]),
      // id_supplier: new FormControl("", [Validators.required]),
    });
 }

 onFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.selectedFile = file;
  }
}

 addProduct(formData: Pick<Product, "title" | "description" | "price" | "category" | "stock" | "image">): void {
    if (this.productForm.valid) {
      this.productService.createProduct(formData).pipe(first()).subscribe(() => {
        this.create.emit(null);
      })
      console.log(formData);
      this.productForm.reset();
      this.formDirective.resetForm();
    } else {
      console.log("The product form is not valid");
    }
 }
}

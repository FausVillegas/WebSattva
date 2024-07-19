import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import initMercadoPago, { MercadoPagoInstance } from '@mercadopago/sdk-react/mercadoPago/initMercadoPago';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-class-event-details',
  templateUrl: './class-event-details.component.html',
  styleUrls: ['./class-event-details.component.css']
})
export class ClassEventDetailsComponent {
  apiUrl = "http://localhost:3000/payment";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
    this.initializeMercadoPago();
  }

  async createPreference(): Promise<void> {
    console.log("checkout-btn--------------------");
      try {
        const orderData = {
          title: this.data.title || '',
          quantity: 1,
          // price: this.data.price,
          price: 100,
          userId: this.authService.getUserId(), // Obtain userId from your authentication context
          eventId: this.data.id // Obtain eventId from the selected event
        };

        const response = await fetch(`${this.apiUrl}/create-preference`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const preference = await response.json();

        this.createCheckoutButton(preference.id);
      } catch (error) {
        alert("Error");
      }
  }

  initializeMercadoPago(): void {
    initMercadoPago("APP_USR-b16bba25-a361-4581-a38f-96df04bfce02", {
      locale: 'es-AR'
    });
  }

  async createCheckoutButton(preferenceId: string): Promise<void> {
    const mp = await MercadoPagoInstance.getInstance();
    const bricksBuilder = mp?.bricks();
      const renderComponent = async () => {
        const walletContainer = document.getElementById("wallet_container");
        if (walletContainer) walletContainer.innerHTML = "";
        await bricksBuilder?.create("wallet", "wallet_container", {
          initialization: {
            preferenceId: preferenceId,
          },
          customization: {
            texts: {
              valueProp: 'smart_option',
            },
          },
        });
      };
      renderComponent();
  }
}

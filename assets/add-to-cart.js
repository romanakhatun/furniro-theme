// jQuery(document).ready(function ($) {
//   let addToCartForm = document.querySelector('form[action$="/cart/add"]');

//   $(addToCartForm).on("submit", function (e) {
//     e.preventDefault();

//     // change this from button[type="submit"] text to loading
//     let submitButton = $(this).find('button[type="submit"]');
//     submitButton
//       .empty()
//       .append(
//         '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>'
//       );

//     console.log("Add to cart form submitted");
//     let formData = {
//       items: [
//         {
//           id: $("#variant_id").val(),
//           quantity: $("input[name='quantity']").val() || 1, // Default to 1 if quantity is not specified
//         },
//       ],
//     };
//     console.log("Variant ID:", $("#variant_id").val());
//     console.log("Quantity:", $("input[name='quantity']").val());
//     console.log("Form data:", formData);

//     $.ajax({
//       type: "POST",
//       url: "/cart/add.js",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: JSON.stringify(formData),
//       dataType: "json",
//       success: function (response) {
//         $.ajax({
//           type: "GET",
//           url: "/cart.js",
//           dataType: "json",

//           success: function (response) {
//             console.log("Cart response:", response);

//             $("#cart-drawer-items").empty();
//             //foreach response
//             $.each(response.items, function (index, item) {
//               $("#cart-drawer-items").append(
//                 `<div class="flex items-center py-2">
//                   <div class="flex-shrink-0">
//                     <img
//                       src="${item.image}" alt="${item.title}"
//                       class="object-cover border border-black/10 rounded-lg"
//                       width="64"
//                       height="64"
//                     >
//                   </div>
//                   <div class="flex-1 ml-4">
//                     <h4 class="text-sm font-semibold">${item.title}</h4>
//                     <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
//                   </div>
//                 </div>
//               `
//               );
//             });
//           },
//         });

//         $(addToCartForm).find('button[type="submit"]').text("Added to Cart");
//         $(".cart-drawer").removeClass("hidden");
//       },
//       error: function (error) {
//         $(addToCartForm).find('button[type="submit"]').text("Added to Cart");
//       },
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  const addToCartForm = document.querySelector('form[action$="/cart/add"]');

  addToCartForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    `;

    const variantId = document.getElementById("variant_id").value;
    const quantity =
      document.querySelector("input[name='quantity']")?.value || 1;

    const formData = {
      items: [
        {
          id: variantId,
          quantity: quantity,
        },
      ],
    };

    console.log("Variant ID:", variantId);
    console.log("Quantity:", quantity);
    console.log("Form data:", formData);

    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        return fetch("/cart.js");
      })
      .then((res) => res.json())
      .then((cartData) => {
        const cartDrawerItems = document.getElementById("cart-drawer-items");
        cartDrawerItems.innerHTML = "";

        cartData.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "flex items-center py-2";

          itemDiv.innerHTML = `
            <div class="flex-shrink-0">
              <img
                src="${item.image}" alt="${item.title}"
                class="object-cover border border-black/10 rounded-lg"
                width="64"
                height="64"
              >
            </div>
            <div class="flex-1 ml-4">
              <h4 class="text-sm font-semibold">${item.title}</h4>
              <p class="text-sm text-gray-500">Quantity: ${item.quantity}</p>
            </div>
          `;

          cartDrawerItems.appendChild(itemDiv);
        });

        submitButton.textContent = "Added to Cart";
        document.querySelector(".cart-drawer").classList.remove("hidden");
      })
      .catch((error) => {
        console.error("Add to cart failed", error);
        submitButton.textContent = "Added to Cart";
      });
  });
});

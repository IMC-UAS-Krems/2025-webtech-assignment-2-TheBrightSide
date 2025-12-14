const CURRENCY = "EUR";
const DISCOUNT_PERCENT = 0.3;
const DISCOUNT_AT_COUNT = 3;
const TAX_RATE = 0.2;

const PURCHASEABLE_PRODUCTS = {
  backpack: {
    name: "Backpack",
    price: 35.0,
    image_url: "imgs/backpack.jpg",
  },
  baseball_cap: {
    name: "Baseball Cap",
    price: 15.0,
    image_url: "imgs/baseball_cap.jpg",
  },
  coffee_mug: {
    name: "Coffee Mug",
    price: 10.0,
    image_url: "imgs/coffee_mug.jpg",
  },
  hoodie: {
    name: "Hoodie",
    price: 45.0,
    image_url: "imgs/hoodie.jpg",
  },
  jacket: {
    name: "Jacket",
    price: 70.0,
    image_url: "imgs/jacket.jpg",
  },
  notepad: {
    name: "Notepad",
    price: 4.0,
    image_url: "imgs/notepad.jpg",
  },
  pen: {
    name: "Pen",
    price: 2.0,
    image_url: "imgs/pen.jpg",
  },
  labels: {
    name: "Labels",
    price: 1.0,
    image_url: "imgs/stickers.jpg",
  },
  t_shirt: {
    name: "T Shirt",
    price: 18.0,
    image_url: "imgs/t_shirt.jpg",
  },
  tote_bag: {
    name: "Tote Bag",
    price: 10.0,
    image_url: "imgs/tote_bag.jpg",
  },
};

/**
 * @type HTMLFormElement | null
 */
const addressForm = document.querySelector("#address-info");
const productGrid = document.querySelector("#product-grid");
const confirmationModal = document.querySelector("#confirmation-modal");

let selectedProducts = [];

function cartButtonHandler(productID) {
  const formFieldset = addressForm.getElementsByTagName("fieldset")[0];

  if (formFieldset.hasAttribute("disabled"))
    formFieldset.removeAttribute("disabled");

  selectedProducts.push(productID);

  const receiptElement = document.querySelector("#receipt");
  receiptElement.innerHTML = "";
  receiptElement.append(...productGenerateReceipt());
}

function generateSingleRowLRText(textLeft, textRight) {
  const element = document.createElement("div");
  element.classList.add("row");

  const numberElement = document.createElement("div");
  numberElement.classList.add("col-auto", "item-number");
  numberElement.innerText = "-";

  const leftElement = document.createElement("div");
  leftElement.classList.add("col", "item-title");
  leftElement.innerText = textLeft;

  const rightElement = document.createElement("div");
  rightElement.classList.add("col", "item-price", "text-end");
  rightElement.innerText = textRight;

  element.append(numberElement, leftElement, rightElement);

  return element;
}

function productGenerateReceipt() {
  const receiptMap = selectedProducts.reduce((acc, x) => {
    if (!(x in acc)) acc[x] = 0;
    acc[x]++;
    return acc;
  }, {});

  const totalPrice = Object.entries(receiptMap).reduce(
    (acc, [id, count]) => acc + PURCHASEABLE_PRODUCTS[id].price * count,
    0,
  );

  const totalCount = Object.entries(receiptMap).reduce(
    (acc, [_, count]) => acc + count,
    0,
  );

  const discount =
    totalCount >= DISCOUNT_AT_COUNT ? -(totalPrice * DISCOUNT_PERCENT) : 0;
  const tax = (totalPrice + discount) * TAX_RATE;

  const elements = Object.entries(receiptMap).map(([id, count], index) => {
    const nameElement = document.createElement("div");
    nameElement.classList.add("item-title");
    nameElement.innerText = PURCHASEABLE_PRODUCTS[id].name;

    const subtextElement = document.createElement("div");
    subtextElement.classList.add("item-sub", "text-secondary");
    subtextElement.innerHTML = `${PURCHASEABLE_PRODUCTS[id].price} ${CURRENCY} &times; ${count}`;

    const totalPrice = `${PURCHASEABLE_PRODUCTS[id].price * count} ${CURRENCY}`;

    const firstCol = document.createElement("div");
    firstCol.classList.add("col-auto", "item-number");
    firstCol.innerText = index + 1;

    const secondCol = document.createElement("div");
    secondCol.classList.add("col");
    secondCol.append(nameElement, subtextElement);

    const thirdCol = document.createElement("div");
    thirdCol.classList.add("col", "item-price", "text-end");
    thirdCol.innerText = totalPrice;

    const element = document.createElement("div");
    element.classList.add("row", "align-items-start", "item-row");
    element.append(firstCol, secondCol, thirdCol);

    return element;
  });

  elements.push(
    generateSingleRowLRText("Subtotal:", `${totalPrice} ${CURRENCY}`),
  );
  elements.push(
    generateSingleRowLRText("Discount:", `${discount} ${CURRENCY}`),
  );
  elements.push(
    generateSingleRowLRText(
      `Tax (${DISCOUNT_PERCENT * 100}%):`,
      `${tax} ${CURRENCY}`,
    ),
  );
  elements.push(
    generateSingleRowLRText(
      `Total:`,
      `${totalPrice + discount + tax} ${CURRENCY}`,
    ),
  );

  return elements;
}

function productGenerateCard(productID, product) {
  const cardElement = document.createElement("div");
  const imgElement = document.createElement("img");
  const cardBodyElement = document.createElement("div");
  const cardBodyTitleElement = document.createElement("h5");
  const cardBodyTextElement = document.createElement("p");
  const cardBodyButton = document.createElement("button");

  cardBodyButton.innerText = "Add to cart";
  cardBodyButton.classList.add("btn", "btn-primary");
  cardBodyButton.addEventListener("click", (_) => cartButtonHandler(productID));

  cardBodyTitleElement.classList.add("card-title");
  cardBodyTitleElement.innerText = product.name;

  cardBodyTextElement.classList.add("card-text");
  cardBodyTextElement.innerText = `${product.price} ${CURRENCY}`;

  cardBodyElement.classList.add("card-body");
  cardBodyElement.append(
    cardBodyTitleElement,
    cardBodyTextElement,
    cardBodyButton,
  );

  imgElement.classList.add("card-img-top", "h-100");
  imgElement.style.objectFit = "cover";
  imgElement.src = product.image_url;
  imgElement.alt = product.name;

  cardElement.classList.add("card", "my-3");
  cardElement.style.height = "500px";
  cardElement.append(imgElement, cardBodyElement);

  return cardElement;
}

/**
 *
 * @param {Node[]} elementsNodes
 * @param {number} elementsPerRow
 * @returns
 */
function productGenerateGrid(elementNodes, elementsPerRow) {
  let out = [];

  /**
   * @type HTMLDivElement
   */
  let currentRow;
  let elementCounter = 0;

  for (let elementNode of elementNodes) {
    if (elementCounter == elementsPerRow) elementCounter = 0;

    if (elementCounter == 0) {
      if (currentRow) out.push(currentRow);

      currentRow = document.createElement("div");
      currentRow.classList.add("row");
    }

    const element = document.createElement("div");
    element.classList.add("col-12", "col-sm-6", "col-lg-4");
    element.appendChild(elementNode);
    currentRow.appendChild(element);

    elementCounter++;
  }

  if (currentRow.children.length > 0) out.push(currentRow);

  return out;
}

/**
 *
 * @param {{ [k: string]: FormDataEntryValue; }} formData
 */
function generateContactDetails(formData) {
  // this function is split into two parts
  // first replace adds a space before the capital letters
  // second replace capitalizes the first letter
  const camelToTitle = (str) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  };

  return Object.entries(formData).map(([key, value]) =>
    generateSingleRowLRText(`${camelToTitle(key)}: `, value.toString()),
  );
}

/**
 *
 * @param {{ [k: string]: FormDataEntryValue; }} formData
 */
function generateModalBody(formData) {
  let firstTitle = document.createElement("h5");
  firstTitle.innerText = "Purchased Products";

  let secondTitle = document.createElement("h5");
  secondTitle.innerText = "Address Details";

  return [
    firstTitle,
    ...productGenerateReceipt(),
    document.createElement("hr"),
    secondTitle,
    ...generateContactDetails(formData),
  ];
}

addressForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = Object.fromEntries(new FormData(e.target).entries());

  /**
   * @type string | null
   */
  let errorText = null;

  const phoneRegex = /^[0-9]+$/;
  const zipRegex = /^[0-9]{1,6}$/;
  if (data.zip && !zipRegex.test(data.zip)) {
    errorText =
      "Zip code must contain only digits and be between 1 and 6 characters.";
  } else if (data.phone && !phoneRegex.test(data.phone)) {
    errorText = "Phone number must contain only digits.";
  }

  confirmationModal.querySelector("#confirmation-modal-body").innerHTML = "";

  if (errorText) {
    confirmationModal.querySelector("#confirmation-modal-label").innerText =
      "User Error";
    confirmationModal.querySelector("#confirmation-modal-body").innerText =
      errorText;
  } else {
    confirmationModal.querySelector("#confirmation-modal-label").innerText =
      "Thank you for your purchase!";
    confirmationModal
      .querySelector("#confirmation-modal-body")
      .append(...generateModalBody(data));
  }

  new bootstrap.Modal(confirmationModal).show();
});

productGrid.append(
  ...productGenerateGrid(
    Object.entries(PURCHASEABLE_PRODUCTS).map((e) =>
      productGenerateCard(e[0], e[1]),
    ),
    3,
  ),
);

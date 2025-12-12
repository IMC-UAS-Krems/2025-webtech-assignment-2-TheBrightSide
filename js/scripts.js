const CURRENCY = "EUR";
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
  stickers: {
    name: "Stickers",
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

let selectedProducts = [];

function cartButtonHandler(productID) {
  selectedProducts.push(productID);
}

function productGenerateCard(productID, product) {
  const cardElement = document.createElement("div");
  const imgElement = document.createElement("img");
  const cardBodyElement = document.createElement("div");
  const cardBodyTitleElement = document.createElement("h5");
  const cardBodyButton = document.createElement("button");

  cardBodyButton.innerText = "Add to cart";
  cardBodyButton.classList.add("btn", "btn-primary");
  cardBodyButton.addEventListener("click", (_) => cartButtonHandler(productID));

  cardBodyTitleElement.classList.add("card-title");
  cardBodyTitleElement.innerText = product.name;

  cardBodyElement.classList.add("card-body");
  cardBodyElement.append(cardBodyTitleElement, cardBodyButton);

  imgElement.classList.add("card-img-top", "h-100");
  imgElement.style.objectFit = "cover";
  imgElement.src = product.image_url;
  imgElement.alt = product.name;

  cardElement.classList.add("card");
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
    element.classList.add("col-4");
    element.appendChild(elementNode);
    currentRow.appendChild(element);

    elementCounter++;
  }

  if (currentRow.children.length > 0) out.push(currentRow);

  return out;
}

document.querySelector("#product-grid").append(
  ...productGenerateGrid(
    Object.entries(PURCHASEABLE_PRODUCTS).map((e) =>
      productGenerateCard(e[0], e[1]),
    ),
    3,
  ),
);

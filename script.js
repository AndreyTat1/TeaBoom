const productImage = document.querySelector(".product-image");
const imageModal = document.getElementById("imageModal");
const modalClose = document.getElementById("modalClose");

productImage.addEventListener("click", () => {
  imageModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

modalClose.addEventListener("click", () => {
  imageModal.classList.remove("active");
  document.body.style.overflow = "";
});

imageModal.addEventListener("click", (event) => {
  if (event.target === imageModal) {
    imageModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal.classList.contains("active")) {
    imageModal.classList.remove("active");
    document.body.style.overflow = "";
  }
});

document.querySelectorAll(".blok-of-prices").forEach((block) => {
  let count = 0;
  const basket = block.querySelector(".backet");
  const counter = basket.querySelector(".cart-counter");
  block.addEventListener("click", () => {
    count++;
    counter.textContent = count;
    counter.classList.add("active");
  });
});

const moreCategories = document.getElementById("moreCategories");
const hiddenCategories = document.getElementById("hiddenCategories");
const originalParent = moreCategories.parentElement;
const originalNextSibling = moreCategories.nextElementSibling;
const categoriesHeading = originalParent.querySelector(".main-cat");
const mediaQuery = window.matchMedia("(max-width: 1048px)");
const compactMediaQuery = window.matchMedia("(max-width: 392px)");
const compactCategoryNodes = [
  ...originalParent.querySelectorAll(":scope > .block-cat:not(.more-categories)"),
  ...hiddenCategories.querySelectorAll(":scope > .block-cat"),
];
const compactVisibleCategories = compactCategoryNodes.slice(0, 3);
const compactHiddenCategories = compactCategoryNodes.slice(3);
let compactCategoriesOpen = false;
let compactLayoutApplied = false;

function updateCompactCategories() {
  if (compactMediaQuery.matches) {
    compactLayoutApplied = true;
    const visibleCategoriesFragment = document.createDocumentFragment();
    compactVisibleCategories.forEach((category) => visibleCategoriesFragment.appendChild(category));
    originalParent.insertBefore(visibleCategoriesFragment, categoriesHeading.nextSibling);
    compactHiddenCategories.forEach((category) => hiddenCategories.appendChild(category));
    if (compactCategoriesOpen) {
      originalParent.insertBefore(moreCategories, hiddenCategories.nextSibling);
    } else {
      originalParent.insertBefore(moreCategories, hiddenCategories);
    }
    moreCategories.style.display = "";
    hiddenCategories.classList.toggle("active", compactCategoriesOpen);
    moreCategories.querySelector(".title-cat").textContent = compactCategoriesOpen
      ? "Скрыть"
      : "Показать больше";
    moreCategories.setAttribute("aria-expanded", String(compactCategoriesOpen));
    return;
  }

  if (!compactLayoutApplied) return;

  compactCategoriesOpen = false;
  hiddenCategories.classList.remove("active");
  originalParent.insertBefore(moreCategories, hiddenCategories);
  const restoredCategoriesFragment = document.createDocumentFragment();
  compactCategoryNodes.slice(0, 9).forEach((category) => restoredCategoriesFragment.appendChild(category));
  originalParent.insertBefore(restoredCategoriesFragment, moreCategories);
  compactCategoryNodes.slice(9).forEach((category) => hiddenCategories.appendChild(category));
  moreCategories.querySelector(".title-cat").textContent = "...";
  moreCategories.removeAttribute("aria-expanded");
  compactLayoutApplied = false;
}

function updateCategories() {
  updateCompactCategories();
  if (compactMediaQuery.matches) return;

  if (mediaQuery.matches) {
    hiddenCategories.classList.add("active");
    moreCategories.style.display = "none";
  } else {
    hiddenCategories.classList.remove("active");
    moreCategories.style.display = "";
    originalParent.insertBefore(moreCategories, originalNextSibling);
  }
}

moreCategories.addEventListener("click", () => {
  if (compactMediaQuery.matches) {
    compactCategoriesOpen = !compactCategoriesOpen;
    updateCompactCategories();
    return;
  }
  if (mediaQuery.matches) return;
  const isOpen = hiddenCategories.classList.contains("active");
  if (!isOpen) {
    hiddenCategories.classList.add("active");
    hiddenCategories.appendChild(moreCategories);
  } else {
    hiddenCategories.classList.remove("active");
    originalParent.insertBefore(moreCategories, originalNextSibling);
  }
});
mediaQuery.addEventListener("change", updateCategories);
compactMediaQuery.addEventListener("change", updateCategories);
updateCategories();

import { getOrderDetailsForReorder } from "../services/getOrderDetailsForReorder";
import { getProductItem } from "../services/getProductItem";

const createSingleUom = (multiple_uoms: any) => (ordered_uom: any) => {
  const multiUom = multiple_uoms.find(
    (i: any) => String(i.variant_id) === String(ordered_uom.variant_id)
  );

  return {
    ...multiUom,
    ...ordered_uom,
    id: ordered_uom.uom_id,
    variant_id: ordered_uom.variant_id,
    price: parseFloat(ordered_uom.price),
    qty: ordered_uom.cart_quantity,
    availability: multiUom?.is_available || true,
    visibility: multiUom?.is_visible || true,
  };
};

async function createSingleItemObject(product: any) {
  const response = await getProductItem(product?.id);

  const cartItemToBeAdded = {
    ...response.data,
    ...product,
    id: product.id,
    item_code: product.item_code,
    availability: product.availability,
    uom: product.ordered_uoms.map(
      createSingleUom(response?.data?.multiple_uoms)
    ),
  };
  return cartItemToBeAdded;
}

export default async function fabricateReOrderItemsList(id: string) {
  const order = await getOrderDetailsForReorder(id);

  const editProducts = order?.items?.map((product: any) =>
    createSingleItemObject(product)
  );

  try {
    const result = await Promise.all(editProducts);

    return result;
  } catch (e) {
    //
  }
  return null;
}

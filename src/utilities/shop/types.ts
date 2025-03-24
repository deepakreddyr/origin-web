export interface UOM {
    variant_id: number
    name: string | null
    uom_id: number
    unit: string
    minimum_quantity: number
    maximum_quantity: number
    stepper_quantity: number
    is_visible: boolean
    is_available: boolean
    is_default: boolean
    price: number
    platform_id: number
    formatted_price: string
    cart_quantity: number
    conversion_text: string
    is_not_discounted: boolean
    ripeness_types: null
    cart_ripeness: any[]
    market_price: number
}

export interface Product {
    availability: boolean
    description: string
    extra_descriptions: []
    id: number
    image: string
    is_collaborate_item: boolean
    item_code: string
    item_name: string
    logo: string
    multiple_uoms: UOM[]
    name: string
    provider_id: any
    tag_text: any
    tag_url: any
    title: any
    uom: []
    website_image: string
}

export interface CartItem {
    id: number
    name: string
    quantity: number
    totalPrice: number
    discountPrice: number
    originalPrice: number
    unit: string
    illustration: string
}

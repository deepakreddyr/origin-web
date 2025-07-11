export type MenuItemType = {
    label: string
    link: string
}

export type MainMenuType = {
    label: string
    link?: string // Optional link, in case not all items have a link
    submenu?: Array<MenuItemType> // Optional submenu
}

export type FooterLink = {
    text: string
    href: string
}

export type ContactDetailsType = {
    address: string
    phone: string
    email: string
    whatsapp: string
}

export type FooterDataType = {
    footerLinksPrimary: any[]
    footerLinksSecondary: any[]
    contactDetails: ContactDetailsType
}
export type UspCardsData = Array<{
    icon: string
    title: string
}>

// shop start
export interface Navigation {
    title: string
    to: string
}

export interface Header {
    type: string
    title: string
    color: string
}
export interface SubCategory {
    id: number
    name: string
}
export interface Category {
    id: number
    actionLabel: string
    name: string
    type: string
    image: string
    website_image: string
    bg_color: string
    navigation: Navigation
    header: Header
    tag: string | null
    image_type: string
    sub_categories: SubCategory[]
    url:string
}
export type ShopDetails = {
    type: string
    title: string
    navigation: Navigation
    data: Category[]
}

export type Categories = Array<Category>

export type ShopDataType = Array<ShopDetails>
// shop end

export type ProductStockStatus = "IN_STOCK" | "OUT_OF_STOCK"
export type ProductTypeNames = "SIMPLE_PRODUCT" | "CONFIGURABLE_PRODUCT"
export type ProductFilters = Array<
    "get-sameday" | "get-tomorrow" | "recommended" | "buyagain" | "combos"
>
export type Products = Array<Product>
export type Product = {
    popular?: boolean
    sku: string
    image: string
    name: string
    description: string
    shortDescription: string
    productType: ProductTypeNames
    stockStatus: ProductStockStatus
    quantity: number
    weight: {
        value: number
        units: string
    }
    price: {
        mrp: string
        amount: string
        currency: string
    }
    configurableOptions: Array<{
        offer: string | null
        ripeStatus?: string
        weight: {
            value: number
            units: string
        }
        price: {
            mrp: string
            amount: string
            currency: string
        }
        quantity: number
        stockStatus: ProductStockStatus
    }> | null
    filters: ProductFilters
}

export type Testimonial = {
    user: {
        image: string
        title: string
        subtitle: string
    }
    content: string
}
export type ImageType = { url: string; title: string; alt: string }

export type ButtonType = { label: string; data: string }

export type overlapCardsList = {
    title: string
    desc: string
    bannerImage: ImageType
}

export type openRolesList = {
    role: string
    city: string
    link: string
}

export type CareersData = {
    banner: {
        title: string
        desc: string
        bannerImage: ImageType
        button: ButtonType
    }
    banner2: {
        title: string
        desc: string
        bannerImage: ImageType
    }
    overlapCards: overlapCardsList[]
    infoCards: {
        title: string
        desc: string
        cardLists: overlapCardsList[]
    }
    joinOurTeam: {
        title: string
        desc: string
        openRoles: openRolesList[]
    }
}

export type HowItWorksList = {
    image: ImageType
    title: string
    desc: string
}

export type HowItWorksData = {
    banner: {
        title: string
        desc: string
        bannerImage: ImageType
    }
    list: HowItWorksList[]
}

export type Blog = {
    imgSrc: string
    date: string
    slug: string
    title: string
    author: { name: string; image?: string }
    link: string
    tag?: string
    popular?: boolean
    description?: string | undefined
    shortDescription?: string
}
export type Instruction = {
    id: number
    media: { videoSrc: string; alt: string; thumb: string }
    title: string
    description: string
}

export type Recipe = {
    id: number
    shortDescription?: string
    description: string
    slug: string
    popular?: boolean
    tag: string
    title: string
    author: { name: string; image?: string }
    date: string
    link: string
    imgSrc: string
    ingredients: string[]
    instructions: Instruction[]
}

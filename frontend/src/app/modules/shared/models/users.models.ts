export interface User {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    available: boolean
    user_password: string
    isAdmin?: boolean
}


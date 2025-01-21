export interface Purchase {
    invoice_id: string; 
    user_id: number; 
    user_name: string; 
    price_per_ticket: string; 
    total_price: string; 
    purchase_date: Date;
    seats: string[]; 
    movie_title: string; 
    function_date: Date; 
    function_time: string; 
  }
  
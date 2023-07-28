enum OrderStatus {
  DRAFT ='DRAFT',
  PENDING = 'PENDING',  
  IN_PROCESSING = 'IN_PROCESSING',
  AWAITING_SHIPMENT = 'AWAITING_SHIPMENT',
  IN_TRANSIT = 'IN_TRANSIT', 
  DELIVERED = 'DELIVERED',   
  CANCELED = 'CANCELED', 
  COMPLETED = 'COMPLETED',   
}

export default OrderStatus;

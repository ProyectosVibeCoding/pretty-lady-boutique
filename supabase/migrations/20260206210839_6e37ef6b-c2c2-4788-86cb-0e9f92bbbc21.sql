-- Allow authenticated users to insert payments for their own orders
CREATE POLICY "Users can insert payments for own orders"
ON public.payments
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = payments.order_id
    AND orders.user_id = auth.uid()
  )
);
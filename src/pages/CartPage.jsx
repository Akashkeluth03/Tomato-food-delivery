import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useCart } from "../context/CartContext";
import { useFood } from "../context/FoodContext";
import { formatInr, DELIVERY_FEE_INR } from "../utils/formatCurrency";
import { jsPDF } from "jspdf";
import "./CartPage.css";

const downloadReceiptPDF = (order) => {
  if (!order) return;
  
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });
  
  const primaryColor = [255, 99, 71]; 
  const darkColor = [38, 38, 38]; 
  const lightGray = [245, 245, 245];
  const borderGray = [220, 220, 220];
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("FOOD APP", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
  
  doc.text(`Invoice No: ${orderId}`, 135, 20);
  doc.text(`Date & Time: ${dateStr}`, 135, 25);
  doc.text("Status: Paid (COD/Online)", 135, 30);
  
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text("Customer & Delivery Details:", 20, 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Name: Guest Customer", 20, 51);
  doc.text("Payment Mode: Cash on Delivery / Online", 20, 56);
  
  const tableStartY = 70;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(20, tableStartY, 170, 8, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("Item Name", 25, tableStartY + 5.5);
  doc.text("Qty", 120, tableStartY + 5.5);
  doc.text("Price", 145, tableStartY + 5.5);
  doc.text("Total", 170, tableStartY + 5.5);
  
  let currentY = tableStartY + 8;
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  
  order.lines.forEach((item, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(20, currentY, 170, 8, "F");
    }
    
    doc.text(item.name, 25, currentY + 5.5);
    doc.text(String(item.qty), 122, currentY + 5.5);
    const unitPrice = Math.round(item.lineTotal / item.qty);
    doc.text(`Rs. ${unitPrice}`, 145, currentY + 5.5);
    doc.text(`Rs. ${item.lineTotal}`, 170, currentY + 5.5);
    
    currentY += 8;
  });
  
  doc.line(20, currentY, 190, currentY);
  
  currentY += 10;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text("Subtotal:", 135, currentY);
  doc.text(`Rs. ${order.subtotal}`, 170, currentY);
  
  currentY += 6;
  doc.text("Delivery Charges:", 135, currentY);
  doc.text(`Rs. ${order.delivery}`, 170, currentY);
  
  currentY += 6;
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(135, currentY, 190, currentY);
  
  currentY += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Grand Total:", 135, currentY);
  doc.text(`Rs. ${order.total}`, 170, currentY);
  
  currentY += 30;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text("Thank you for ordering with Food App! Your delicious food is on the way.", 105, currentY, { align: "center" });
  
  doc.save(`FoodApp_Invoice_${orderId}.pdf`);
};

function CartPage() {
  const { quantities, addOne, removeOne, clearCart } = useCart();
  const { foodList } = useFood();
  const navigate = useNavigate();
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  useEffect(() => {
    if (!orderConfirmation) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOrderConfirmation(null);
        navigate("/");
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [orderConfirmation, navigate]);

  const lines = foodList
    .filter((item) => (quantities[item._id] || 0) > 0)
    .map((item) => ({
      ...item,
      qty: quantities[item._id],
      lineTotal: Number(item.price) * quantities[item._id],
    }));

  const subtotal = lines.reduce((sum, row) => sum + row.lineTotal, 0);
  const hasItems = lines.length > 0;
  const total = hasItems ? subtotal + DELIVERY_FEE_INR : 0;

  const handleCheckout = () => {
    if (!hasItems) return;
    setOrderConfirmation({
      lines: lines.map((row) => ({
        id: row._id,
        name: row.name,
        qty: row.qty,
        lineTotal: row.lineTotal,
      })),
      subtotal,
      delivery: DELIVERY_FEE_INR,
      total,
    });
    clearCart();
  };

  const dismissOrderModal = () => {
    setOrderConfirmation(null);
    navigate("/");
  };

  return (
    <div className="cart-page app">
      <div className="cart-page-inner">
        <h1 className="cart-page-title">Your cart</h1>

        {!hasItems ? (
          <p className="cart-page-empty">
            No items yet.{" "}
            <Link to="/" className="cart-page-link">
              Browse the menu
            </Link>
          </p>
        ) : (
          <>
            <ul className="cart-lines">
              {lines.map((row) => (
                <li key={row._id} className="cart-line">
                  <img className="cart-line-img" src={row.image} alt="" />
                  <div className="cart-line-body">
                    <p className="cart-line-name">{row.name}</p>
                    <p className="cart-line-price">
                      {formatInr(row.price)} each · {formatInr(row.lineTotal)}{" "}
                      total
                    </p>
                    <div className="cart-line-actions">
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => removeOne(row._id)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty">{row.qty}</span>
                      <button
                        type="button"
                        className="cart-qty-btn"
                        onClick={() => addOne(row._id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>{formatInr(DELIVERY_FEE_INR)}</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>{formatInr(total)}</span>
              </div>
              <button
                type="button"
                className="cart-checkout-btn"
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      {orderConfirmation && (
        <div
          className="order-modal-overlay"
          role="presentation"
          onClick={dismissOrderModal}
        >
          <div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="order-modal-close"
              onClick={dismissOrderModal}
              aria-label="Close"
            >
              <img src={assets.cross_icon} alt="" />
            </button>
            <h2 id="order-modal-title" className="order-modal-title">
              Order placed
            </h2>
            <p className="order-modal-msg">
              Thanks! Your order has been received and is being prepared.
            </p>
            <ul className="order-modal-lines">
              {orderConfirmation.lines.map((row) => (
                <li key={row.id} className="order-modal-line">
                  <span>
                    {row.name} × {row.qty}
                  </span>
                  <span>{formatInr(row.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="order-modal-summary">
              <div className="order-modal-row">
                <span>Subtotal</span>
                <span>{formatInr(orderConfirmation.subtotal)}</span>
              </div>
              <div className="order-modal-row">
                <span>Delivery</span>
                <span>{formatInr(orderConfirmation.delivery)}</span>
              </div>
              <div className="order-modal-row order-modal-total">
                <span>Total paid</span>
                <span>{formatInr(orderConfirmation.total)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "20px", width: "100%" }}>
              <button
                type="button"
                className="order-modal-btn"
                onClick={() => downloadReceiptPDF(orderConfirmation)}
                style={{ backgroundColor: "#48c479" }}
              >
                Download Bill PDF
              </button>
              <button
                type="button"
                className="order-modal-btn"
                onClick={dismissOrderModal}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;

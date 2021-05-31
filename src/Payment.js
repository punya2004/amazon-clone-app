import React, { useEffect, useState } from 'react';
import './Payment.css';
import { useStateValue } from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link } from '@material-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './Reducer';
import { useHistory } from 'react-router';
import axios from './axios';

function Payment() {

    const [{basket, user}, dispatch] = useStateValue();

    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const [processing, setProcessing] = useState(false);
    const [succeeeded, setSucceeeded] = useState("");
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        //generate the special stripe secret that charge the customer
        const getClientSceret = async() => {
            const response = await axios({
                method:'post',
                //stripe expects the total in a currency subunits
                url:`/payments/create?total=${getBasketTotal(basket) * 100}`
            })
            setClientSecret(response.data.clientSecret)
        }
        getClientSceret();
    }, [basket])

    console.log("the secret is ", clientSecret)
    console.log(user)

    const handleSubmit = async(event) => {
        event.preventDefault(); 
        setProcessing(true)
        
        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
   
            setSucceeeded(true);
            setError(null);
            setProcessing(false);

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders')
        })
    }
    
    const handleChange = (event) => {
        //listen for changes in card element
        //show any error if the user types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

    return (
        <div className="payment">
            <div className="payment__container">
                <h1>
                    Checkout {<Link to="/checkout">{basket.length} items</Link>}
                </h1>
                {/* delivery address */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Delivery Address</h3>
                    </div>
                    <div className="payment__adaress">
                        <p>testuser@gmail.com</p>
                        <p>123 react lane</p>
                        <p>california</p>
                    </div>
                </div>
                {/* review items */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Review items and delivery</h3>
                    </div>
                    <div className="payment__items">
                        {basket.map(function add(item) {
                            return (
                                <CheckoutProduct
                                    id={item.id}
                                    title={item.title}
                                    image={item.image}
                                    rating={item.rating}
                                    price={item.price}
                                />
                            )
                        })}
                    </div>
                </div>
                {/* make payment */}
                <div className="payment__section">
                    <div className="payment__title">
                        <h3>Payment Metod</h3>
                    </div>
                    <div className="payment__details">
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange}/>
                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <div>                                            
                                            <h3>Order Total:{value}</h3>                                           
                                        </div>
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled || succeeeded}>
                                    <span>{processing ? <p>processing</p> : "Buy Now"}</span>
                                </button>
                            </div>
                            {/* when there is any error */}
                            {error && <div>{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment

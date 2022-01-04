import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import useFetch from "./useFetch";
import ItemList from "./ItemList";
import axios from 'axios';
import { useHistory } from "react-router";
import './Purchase.css'
// import { Button } from './Button';
import Categories from './categories';
import 'bootstrap/dist/css/bootstrap.min.css'

const Purchase = ({ user_uid }) => {
    const [order, setOrder] = useState({
        buyQuantity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    });


    const { data: onSale, error, isPending } = useFetch("http://localhost:7000/item_query");
    const json_parse = onSale;
    const onSaleItems = JSON.parse(json_parse);

    const history = useHistory();

    const addOneItem = (id) => {
        console.log(id)
        let newOrder = order;
        newOrder.buyQuantity[id] = order.buyQuantity[id] + 1;
        setOrder({ ...newOrder });
    }

    const delOneItem = (id) => {
        let newOrder = order;
        if (order.buyQuantity[id] > 0) {
            newOrder.buyQuantity[id] = order.buyQuantity[id] - 1;
            setOrder({ ...newOrder });
        }
    }

    // console.log('user_uid: ', user_uid.replace('-', ''));

    const purchaseHandler = () => {
        const array1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
        // array1.forEach( element =>

        axios
            .post("http://localhost:7000/depost_order", {
                names: array1,
                quantity: order.buyQuantity,
                user_uid: user_uid

            }).then((data) => {
                const res_data = data.data;

                console.log('res_data: ', res_data);
                if (res_data.length > 0) {
                    alert(res_data);
                }
                else {
                    history.push("/payment");
                }

            })
            .catch((e) => {
                console.log(e);
                alert("failed", e);
            });

    }

    const [data, setData] = useState(Categories);
    const filterResult = (cateItem) => {
        const result = Categories.filter((currData) => {
            return currData.category === cateItem;
        });
        setData(result)
    }
    return (

        <div className="purchase">
            {/* {isPending && <div>Loading...</div>}
            {error && <div>{error}</div>}

            {onSaleItems &&
                <ItemList items={onSaleItems} 
                        order={order}
                        addOneItem={addOneItem} 
                        delOneItem={delOneItem} 
                        title="All Products"/>
            }
            {/* <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large' onClick={() => purchaseHandler()}>
                Purchase
            </Button> */}

            <h5 class="text-center text-info">Let's shop</h5>
            <div className="container-fluid mx-2">
                <div className="row mt-5 mx-2">
                    <div className="col-md-3 md-4">
                        <button className="btn btn-primary w-100 mb-4" onClick={() => filterResult('Skates')}>Roller Skates</button>
                        <button className="btn btn-primary w-100 mb-4" onClick={() => filterResult('Pads')}>Pads</button>
                        <button className="btn btn-primary w-100 mb-4" onClick={() => filterResult('Wheels')}>Wheels</button>
                        <button className="btn btn-primary w-100 mb-4" onClick={() => filterResult('Helmet')}>Helmet</button>
                        <button className="btn btn-primary w-100 mb-4" onClick={() => setData(Categories)}>ALL</button>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            {data.map((values) => {
                                const { id, category, name, price, picLink } = values;
                                return (
                                    <>
                                        <div className="col-md-4 mb-4" key={id}>
                                            <div class="card">
                                                <img class="card-img-top" src={picLink} alt="Card image cap" />
                                                <div class="card-body">
                                                    <h5 class="card-title">{name}</h5>
                                                    <p>Price: {price}</p>
                                                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                    <button className="btn btn-dark">buy it now</button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}

                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="col-12 text-center">
                    <button class='btn btn-primary' onClick={() => purchaseHandler()}>Proceed to checkout</button>
                </div>
            </div>


        </div>
    );
}

export default Purchase;
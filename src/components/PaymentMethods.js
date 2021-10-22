import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import CreditCard from '../components/CreditCard';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../assets/styles/components/PaymentMethods.scss';

function PaymentMethods() {
  const user_id = useSelector((state) => state.currentUser._id);
  const user_email = useSelector((state) => state.currentUser.email);
  const user_name = useSelector((state) => state.currentUser.name);
  const firstName = user_name.split(' ')[0];
  const lastName = user_name.split(' ')[1];
  const MySwal = withReactContent(Swal);
  const [paymentInfo, setPaymentInfo] = useState({
    doc_type: '',
    doc_number: '',
  });
  const [cardName, setCardName] = useState({
    card_name: user_name,
  });
  const [hidden, setHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [epayco_customer_id, setEpayco_customer_id] = useState(null);
  const [existingCards, setExistingCards] = useState({
    cards: [],
  });
  const [cardInfo, setCardInfo] = useState({
    'card[number]': '',
    'card[exp_year]': '',
    'card[exp_month]': '',
    'card[cvc]': '',
  });
  const [customerInfo] = useState({
    name: firstName,
    last_name: lastName,
    email: user_email,
  });
  const [errors, setErrors] = useState({
    doc_type: '',
    doc_number: '',
    'card[number]': '',
    'card[exp_year]': '',
    'card[exp_month]': '',
    'card[cvc]': '',
    card_name: '',
  });
  const [isValid, setIsValid] = useState({
    doc_type: false,
    doc_number: false,
    'card[number]': false,
    'card[exp_year]': false,
    'card[exp_month]': false,
    'card[cvc]': false,
    card_name: true,
  });

  useEffect(() => {
    axios.get(`/get-customer?id=${user_id}`).then((result) => {
      const customer = result.data.customer.data;
      if (customer.id_customer) {
        setEpayco_customer_id(customer.id_customer);
        setExistingCards((prevState) => ({
          ...prevState,
          cards: customer.cards,
        }));
        setIsValid((prevState) => ({
          ...prevState,
          doc_type: true,
          doc_number: true,
        }));
      }
      setIsLoading(false);
    });
  }, [epayco_customer_id, user_id]);

  function cardInfoChange(e) {
    setCardInfo((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }

  function cardNameChange(e) {
    setCardName((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }

  function paymentInfoChange(e) {
    setPaymentInfo((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }

  function validateinputs(e) {
    const input = e.target.name;
    const value = e.target.value;
    const textRegex = /^[a-zA-Z\s]*$/;
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !value &&
      (input === 'card[exp_month]' ||
        input === 'card[exp_year]' ||
        input === 'card[cvc]' ||
        input === 'doc_type' ||
        input === 'doc_number')
    ) {
      setErrors((state) => ({
        ...state,
        [input]: 'this fields are mandatory, please fill each one of them',
      }));
      setIsValid((state) => ({
        ...state,
        [input]: false,
      }));
    } else if (!value) {
      setErrors((state) => ({
        ...state,
        [input]: 'this field is mandatory',
      }));
      setIsValid((state) => ({
        ...state,
        [input]: false,
      }));
    } else if (input === 'card_name' && !textRegex.test(String(e.target.value).toLowerCase())) {
      setErrors((state) => ({
        ...state,
        [input]: 'field must only contain letters',
      }));
      setIsValid((state) => ({
        ...state,
        [input]: false,
      }));
    } else if (input === 'email' && !emailRegex.test(String(value).toLowerCase())) {
      setErrors((state) => ({
        ...state,
        [input]: 'please enter a valid email',
      }));
      setIsValid((state) => ({
        ...state,
        [input]: false,
      }));
    } else {
      setErrors((state) => ({
        ...state,
        [input]: '',
      }));
      setIsValid((state) => ({
        ...state,
        [input]: true,
      }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    handleCancel();
    try {
      if (epayco_customer_id) {
        await axios.post('/create-card', {
          epayco_customer_id,
          cardInfo,
        });
      } else {
        await axios.post('/create-user', {
          user_id,
          customerInfo,
          cardInfo,
        });
      }
      await axios
        .get(`/get-customer?id=${user_id}`)
        .then((result) => {
          const customer = result.data.customer.data;
          setEpayco_customer_id(customer.id_customer);
          if (customer.id_customer) {
            setExistingCards((prevState) => ({
              ...prevState,
              cards: customer.cards,
            }));
          }
        })
        .then(() => {
          setIsLoading(false);
          MySwal.fire({
            icon: 'success',
            title: <p className="swal__tittle">Card created</p>,
            confirmButtonColor: '#0de26f',
          });
        });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response.data;
      MySwal.fire({
        icon: 'error',
        title: <p className="swal__tittle">Oops... Please try again</p>,
        text: errorMessage,
        confirmButtonColor: '#ce4c4c',
      });
    }
  }

  async function deleteCard(card) {
    setIsLoading(true);
    try {
      await axios.post('/delete-card', {
        epayco_customer_id,
        franchise: card.franchise,
        mask: card.mask,
      });
      await axios
        .get(`/get-customer?id=${user_id}`)
        .then((result) => {
          const customer = result.data.customer.data;
          setEpayco_customer_id(customer.id_customer);
          if (customer.id_customer) {
            setExistingCards((prevState) => ({
              ...prevState,
              cards: customer.cards,
            }));
          }
        })
        .then(() => {
          setIsLoading(false);
          MySwal.fire({
            icon: 'success',
            title: <p className="swal__tittle">Card deleted</p>,
            confirmButtonColor: '#0de26f',
          });
        });
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err.response.data;
      MySwal.fire({
        icon: 'error',
        title: <p className="swal__tittle">Oops... Please try again</p>,
        text: errorMessage,
        confirmButtonColor: '#ce4c4c',
      });
    }
  }

  function handleCancel() {
    setHidden(true);
    setCardInfo({
      'card[number]': '',
      'card[exp_year]': '',
      'card[exp_month]': '',
      'card[cvc]': '',
    });
    setErrors({
      doc_type: '',
      doc_number: '',
      'card[number]': '',
      'card[exp_year]': '',
      'card[exp_month]': '',
      'card[cvc]': '',
      card_name: '',
    });
    setIsValid({
      doc_type: false,
      doc_number: false,
      'card[number]': false,
      'card[exp_year]': false,
      'card[exp_month]': false,
      'card[cvc]': false,
      card_name: true,
    });
    setPaymentInfo({
      doc_type: '',
      doc_number: '',
    });
  }

  return (
    <div className="payment-method__page-body">
      <h2 className="payment-method__credit-card-title">My Credit Cards</h2>
      <button onClick={() => setHidden(false)} hidden={!hidden} className="payment-method__button-add">
        add card
      </button>
      {!hidden && (
        <form action="" className="payment-method__form" onSubmit={handleSubmit}>
          <div className="payment-method__form-slot">
            <label>name on card</label>
            <input
              type="text"
              name="card_name"
              value={cardName.card_name}
              onChange={cardNameChange}
              onBlur={validateinputs}
            />
            <span className="payment-method__errors">{errors.card_name}</span>
          </div>
          <div className="payment-method__form-slot">
            <label>card number</label>
            <input
              type="number"
              name="card[number]"
              value={cardInfo['card[number]']}
              onChange={cardInfoChange}
              onBlur={validateinputs}
            />
            <span className="payment-method__errors">{errors['card[number]']}</span>
          </div>
          <div className="payment-method__card-form">
            <div className="payment-method__card-form-slot">
              <label>exp date</label>
              <select
                name="card[exp_month]"
                id="month"
                onChange={cardInfoChange}
                onBlur={validateinputs}
                value={cardInfo['card[exp_month]']}
              >
                <option value={0} hidden>
                  month
                </option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
              </select>
            </div>
            <div className="payment-method__card-form-slot">
              <label className="payment-method__hidden">.</label>
              <input
                type="number"
                name="card[exp_year]"
                placeholder="year"
                onChange={cardInfoChange}
                onBlur={validateinputs}
              />
            </div>
            <div className="payment-method__cvc-form-slot">
              <label>cvc</label>
              <input
                type="number"
                name="card[cvc]"
                value={cardInfo['card[cvc]']}
                onChange={cardInfoChange}
                onBlur={validateinputs}
              />
            </div>
          </div>
          <span className="payment-method__errors">
            {errors['card[cvc]'] || errors['card[exp_year]'] || errors['card[exp_month]']}
          </span>
          {!epayco_customer_id && (
            <div className="payment-method__card-form">
              <div className="payment-method__id-type-form-slot">
                <label>id type</label>
                <select
                  name="doc_type"
                  id="doc_type"
                  onChange={paymentInfoChange}
                  value={paymentInfo.doc_type}
                  onBlur={validateinputs}
                >
                  <option value={0} hidden>
                    please select
                  </option>
                  <option value="cc">CC</option>
                  <option value="nit">NIT</option>
                </select>
              </div>
              <div className="payment-method__id-num-form-slot">
                <label>id number</label>
                <input
                  name="doc_number"
                  type="number"
                  value={paymentInfo.doc_number}
                  onChange={paymentInfoChange}
                  onBlur={validateinputs}
                />
              </div>
            </div>
          )}
          <span className="payment-method__errors">{errors.doc_type || errors.doc_number}</span>
          <div className="payment-method__button-container">
            <button
              className="payment-method__button-add"
              disabled={
                !(
                  isValid.doc_type &&
                  isValid.doc_number &&
                  isValid['card[number]'] &&
                  isValid['card[exp_year]'] &&
                  isValid['card[exp_month]'] &&
                  isValid['card[cvc]'] &&
                  isValid.card_name
                )
              }
            >
              add card
            </button>
            <button onClick={handleCancel} className="payment-method__button-cancel">
              cancel
            </button>
          </div>
        </form>
      )}
      {isLoading ? (
        <Loader />
      ) : existingCards.cards.length === 0 ? (
        <></>
      ) : (
        <div>
          {existingCards.cards.map((card) => {
            return <CreditCard card={card} key={card.token} deleteCard={deleteCard} />;
          })}
        </div>
      )}
    </div>
  );
}

export default PaymentMethods;
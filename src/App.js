import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

const inventory = {
  a: { name: '🧉 Yerba Mate', price: 10 },
  b: { name: '☕️ Coffee', price: 15 },
  c: { name: '🍵 Tea', price: 7.5 },
};

const destinations = { US: 25, CA: 35, CO: 45 };

const cartState = atom({
  key: 'cartState',
  default: {},
});

const shippingState = atom({
  key: 'shippingState',
  default: 'US',
});

function App() {
  return (
    <RecoilRoot>
      <AvailableItems />
      <Cart />
    </RecoilRoot>
  );
}

function AvailableItems() {
  const [cart, setCart] = useRecoilState(cartState);

  return (
    <div>
      <h2>Available Items</h2>
      {/* <pre>{JSON.stringify(cart)}</pre> */}
      <ul>
        {Object.entries(inventory).map(([id, { name, price }]) => (
          <li key={id}>
            {name} @ ${price.toFixed(2)}
            <button
              onClick={() => {
                setCart({
                  ...cart,
                  [id]: (cart[id] || 0) + 1,
                });
              }}
            >
              Add
            </button>
            {cart[id] && (
              <button
                onClick={() => {
                  const copy = { ...cart };
                  if (copy[id] === 1) {
                    delete copy[id];
                    setCart(copy);
                  } else {
                    setCart({ ...cart, [id]: copy[id] - 1 });
                  }
                }}
              >
                Remove
              </button>
            )}
            {cart[id] && (
              <button
                onClick={() => {
                  const copy = { ...cart };
                  delete copy[id];
                  setCart(copy);
                }}
              >
                Remove all
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cart() {
  return (
    <div>
      <h2>Cart</h2>
      <CartItems />
      <Shipping />
      <Totals />
    </div>
  );
}

function CartItems() {
  const cart = useRecoilValue(cartState);

  if (Object.keys(cart).length === 0) return <p>No item</p>;

  return (
    <ul>
      {Object.entries(cart).map(([id, quantity]) => (
        <li key={id}>
          {inventory[id].name} x {quantity}
        </li>
      ))}
    </ul>
  );
}

function Shipping() {
  const [shipping, setShipping] = useRecoilState(shippingState);

  return (
    <div>
      <h2>Shipping</h2>
      <ul>
        {Object.entries(destinations).map(([country, price]) => (
          <button
            onClick={() => {
              setShipping(country);
            }}
          >
            {country} @ ${price.toFixed(2)}
            {country === shipping ? <span> ✅</span> : ''}
          </button>
        ))}
      </ul>
    </div>
  );
}

const totalsState = selector({
  key: 'totalsState',
  get: ({ get }) => {
    const cart = get(cartState);
    const shipping = get(shippingState);

    const subTotal = Object.entries(cart).reduce(
      (accumulator, [id, quantity]) =>
        accumulator + inventory[id].price * quantity,
      0
    );
    const shippingTotal = destinations[shipping];

    return {
      subTotal,
      shipping: shippingTotal,
      total: subTotal + shippingTotal,
    };
  },
});

function Totals() {
  const totals = useRecoilValue(totalsState);

  return (
    <div>
      <h2>Totals</h2>
      <p>Sub Total: ${totals.subTotal.toFixed(2)}</p>
      <p>Shipping: ${totals.shipping.toFixed(2)}</p>
      <p>
        <strong>Total: ${totals.total.toFixed(2)}</strong>
      </p>
    </div>
  );
}

export default App;

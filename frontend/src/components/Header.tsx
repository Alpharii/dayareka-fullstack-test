const Header = () => {
    return (
      <div className="p-4 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Customer</h1>
        </div>
        <div className="flex border-b border-gray-300">
            <h1 className="mt-3 scroll text-gray-500">You can manage and organize your customer and other things here</h1>
            <div className="flex mt-4 ml-96 text-lg font-medium">
              <div className="text-center">
                <h1 className="text-sky-600">Customer</h1>
                <hr className="mt-4 border border-sky-600 w-64 mx-auto" />
              </div>
              <div className="text-center text-gray-500">
                <h1>Promo</h1>
                <hr className="mt-4 w-64 mx-auto" />
              </div>
              <div className="text-center text-gray-500">
                <h1>Voucher</h1>
                <hr className="mt-4 w-64 mx-auto" />
              </div>
          </div>
        </div>
      </div>
    );
  };
  
export default Header;
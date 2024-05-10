import { SearchOutlined } from "@ant-design/icons";

const Categories = () => {
  return (
    <div>
      <div>
        <div className="">
          <div className=" w-full">
            <div className="container mx-auto p-5">
              <div className="">
                <div className="">
                  <div className="flex w-5">
                    <input
                      type="search"
                      className="flex-1 border border-gray-300 rounded-l py-3 px-10 focus:outline-none"
                      placeholder="keywords"
                    />
                    <button className="bg-gray-200 px-4 py-3 rounded-r">
                      <i>
                        <SearchOutlined />
                      </i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

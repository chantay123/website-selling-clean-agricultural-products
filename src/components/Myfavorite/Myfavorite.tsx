import { Layout } from "antd";
import HearderItem from "../HeaderItem/HeaderItem";
import requestApi from "../../utils/interceptors";
import { useDispatch, useSelector } from "react-redux";
import { setfavorite } from "../../redux/userReducer/userReducer";
import { useEffect } from "react";
import { RootState } from "../../redux/config";

const Myfavorite = () => {
  const dispatch = useDispatch();
  const favorite = async () => {
    try {
      const response = await requestApi("users/products/favorites", "GET", {});
      console.log(response);
      const a = response.data.data;
      dispatch(setfavorite(a));
    } catch (error) {
      console.log(error);
    }
  };

  const listfavorite = useSelector((state: RootState) => state.user.favorite);
  console.log(listfavorite);
  useEffect(() => {
    favorite();
  }, []);

  return (
    <div>
      <section>
        <Layout>
          <HearderItem />
        </Layout>
      </section>
      <div className="ml-20 mr-20 mt-20">
        <div className="container-fluid py-5">
          <h2 className="text-3xl">My favorite product</h2>
          <div className="container py-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white ">
                <thead className="border-b ">
                  <tr>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider">
                      slug
                    </th>
                    <th className="px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {listfavorite &&
                    listfavorite.map((favorite, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center ">
                            <img
                              className="w-24 h-24 rounded-full"
                              src={favorite.thumbnail_url}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">{favorite.name}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">{favorite.origin}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap"></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myfavorite;

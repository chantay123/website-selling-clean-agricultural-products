import { Layout } from "antd";
import HearderItem from "../HeaderItem/HeaderItem";
import { getFavoriteProducts } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { setfavorite } from "../../redux/userReducer/userReducer";
import { useEffect } from "react";
import { RootState } from "../../redux/config";

const Myfavorite = () => {
  const dispatch = useDispatch();
  const favorite = async () => {
    try {
      const response = await getFavoriteProducts();
      dispatch(setfavorite(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const listfavorite = useSelector((state: RootState) => state.user.favorite);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  useEffect(() => {
    // The favourites are a private resource: calling them for a guest would
    // return a 401 and the interceptor would send the visitor to the login
    // page.
    if (!isAuthenticated) return;

    favorite();
  }, [isAuthenticated]);

  return (
    <div>
      <section>
        <Layout>
          <HearderItem />
        </Layout>
      </section>
      <div className="mx-5 sm:mx-10 lg:ml-20 lg:mr-20 mt-16 sm:mt-20">
        <div className="container-fluid py-5">
          <h2 className="text-2xl sm:text-3xl">My favorite product</h2>
          <div className="container py-5">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white ">
                <thead className="border-b ">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider">
                      origin
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-sm sm:text-base font-medium text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody>
                  {listfavorite &&
                    listfavorite.map((favorite) => (
                      <tr key={favorite._id}>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center ">
                            <img
                              className="w-16 h-16 sm:w-24 sm:h-24 rounded-full object-cover"
                              src={favorite.thumbnail_url}
                              alt={favorite.name}
                            />
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">{favorite.name}</p>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <p className="mb-0 mt-4">{favorite.origin}</p>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap"></td>
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

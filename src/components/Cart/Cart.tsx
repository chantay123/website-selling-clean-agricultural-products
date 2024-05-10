import { Col, Layout, Row } from "antd";
import Button from "../Button";

const style: React.CSSProperties = {
  background: "#f4f6f8 ",
  height: "380px",
};
const Cart = () => {
  return (
    <Layout className="bg-white mt-7">
      <div className="  mb-8 ">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row " span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                Fruits
              </div>
              <div className=" zoom-in-out-box ">
                <a href="">
                  <img
                    className="w-[400px] h-[200px] rounded"
                    src="https://hinh365.com/wp-content/uploads/2020/06/7165fb65d84513110399991ed216e99a.jpg "
                    alt=""
                  />
                </a>
              </div>
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Cherry
              </h2>
              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-base font-bold ">
                  $4.99 / kg
                </p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                Fruits
              </div>
              <img
                className="w-[400px] h-[200px] rounded"
                src="http://127.0.0.1:5500/fruitables-1.0.0/img/fruite-item-5.jpg "
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Grapes
              </h2>
              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                Fruits
              </div>
              <img
                className="w-[400px] h-[200px] rounded"
                src="http://127.0.0.1:5500/fruitables-1.0.0/img/fruite-item-1.jpg"
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Oranges
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-8 py-1 m-3 rounded-[10px] bg-green-400">
                Fruits
              </div>
              <img
                className="w-[400px] h-[200px] rounded "
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6ChPzNZ5MCno36L0eyGl-kx-foUMGXIPKow&s"
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Apples
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className=" mb-8">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Vegetable
              </div>
              <a className="bg-red-700" href="">
                <div>
                  <img
                    className="rounded  w-[400px] h-[200px]"
                    src="https://hips.hearstapps.com/hmg-prod/images/background-with-big-fresh-cabbage-royalty-free-image-1701363221.jpg?crop=1.00xw:0.752xh;0,0.108xh&resize=1200:*"
                    alt=""
                  />
                </div>

                <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                  Cabbage
                </h2>

                <div className="flex  mt-30 items-center justify-evenly mt-5">
                  <p className=" text_money p-4 text-xl font-bold ">
                    $4.99 / kg
                  </p>
                  <Button />
                </div>
              </a>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Vegetable
              </div>
              <img
                className="w-[400px] h-[200px] rounded"
                src="https://www.foodandwine.com/thmb/-Yxlx-cou8lNguYnp5HcNH2rX1Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Potatoes-May-No-Longer-Be-Considered-a-Vegetable-FT-BLOG1223-83fa6005a5bf4210aac4b1cc6fd35774.jpg "
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Potato
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Vegetable
              </div>
              <img
                className="w-[400px] h-[200px] rounded"
                src="https://cdn.britannica.com/39/187439-050-35BA4DCA/Broccoli-florets.jpg"
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Broccoli
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Vegetable
              </div>
              <img
                className="w-[300px] h-[200px] rounded"
                src="https://th-thumbnailer.cdn-si-edu.com/yy6hMDBx8PTcCEaJZH0ZLiSDIeg=/1072x720/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/44/de/44de0f61-47cb-4289-aaf0-73e71d39fefb/2962762666_1237ff6eb4_o.jpg"
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Tomato
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className="mb-8">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Bean
              </div>
              <a className="bg-red-700" href="">
                <div>
                  <img
                    className="rounded  w-[400px] h-[200px]"
                    src="https://blog-images-1.pharmeasy.in/blog/production/wp-content/uploads/2023/07/02074155/871.jpg "
                    alt=""
                  />
                </div>

                <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                  Yardlong bean
                </h2>

                <div className="flex  mt-30 items-center justify-evenly mt-5">
                  <p className=" text_money p-4 text-xl font-bold ">
                    $4.99 / kg
                  </p>
                  <Button />
                </div>
              </a>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Bean
              </div>
              <img
                className="w-[400px] h-[200px] rounded"
                src="https://png.pngtree.com/thumb_back/fw800/background/20231010/pngtree-texture-background-of-peanuts-in-their-shells-accompanied-by-whole-peanuts-image_13622640.png "
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Peanut
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Bean
              </div>
              <img
                className="w-[400px] h-[200px] rounded"
                src="https://s1.storage.5giay.vn/image/2015/03/20150330_7c6c790cfde6fd9425f72956d08d32aa_1427704230.jpg"
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Peas
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-3">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style} className="rounded-[10px] relative">
              <div className=" absolute text-white px-5 py-1 m-3 rounded-[10px] bg-green-400">
                Bean
              </div>
              <img
                className="w-[300px] h-[200px] rounded"
                src="https://m.2lua.vn/temp/resize/400x300/upload/news/03-2018/be296b1c-5aaf2e67e4951901518b4567.jpg"
                alt=""
              />
              <h2 className="flex justify-center text-2xl font-bold mt-8 ">
                Bean green
              </h2>

              <div className="flex  mt-30 items-center justify-evenly mt-5">
                <p className=" text_money p-4 text-xl font-bold ">$4.99 / kg</p>
                <Button />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Cart;

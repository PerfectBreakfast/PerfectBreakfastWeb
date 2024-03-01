import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import menuAPI from "../../../../services/menuAPI";

const MenuDetail = () => {
  const { id } = useParams();
  const [menuDetail, setMenuDetail] = useState(null);

  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        const data = await menuAPI.getMenuById(id);
        setMenuDetail(data);
      } catch (error) {
        console.error("Failed to fetch menu details:", error);
      }
    };

    fetchMenuDetail();
  }, [id]);

  if (!menuDetail) return <div>Loading...</div>;

  return (
    <div>
      <h2>{menuDetail.name}</h2>
      <p>
        Created on: {new Date(menuDetail.creationDate).toLocaleDateString()}
      </p>
      <p>{menuDetail.isSelected ? "Selected" : "Not Selected"}</p>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Foods</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {menuDetail.comboFoodResponses.map((combo) => (
            <tr key={combo.id}>
              <td>
                <img
                  src={combo.image}
                  alt={combo.name}
                  style={{ width: "100px", height: "100px" }}
                />
              </td>
              <td>{combo.name}</td>
              <td>{combo.foods}</td>
              <td>{combo.price.toLocaleString()} VND</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default MenuDetail;

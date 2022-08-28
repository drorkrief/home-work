import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";
function List() {
  const [data, setData] = useState();
  function deletActor(id) {
    let filteredList = data.filter(x => x.person.id !== id )
    setData(filteredList)
  }
  useEffect(() => {
    axios
      .get("/actors")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <>
      {data && (
        <table>
          <thead>
            <tr>
              <th>Comment</th>
              <th></th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((x, i) => (
              <Item deletActor={deletActor} personInfo={x} key={x.person.id} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default List;

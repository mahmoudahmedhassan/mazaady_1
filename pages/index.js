
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Taple from "../taple/Taple";

export default function Home({ data }) {
  const [categorySelected, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState([]);
  const [subCategorySelected, setSubCategorySelected] = useState([]);
  const [properites, setProperties] = useState([]);
  const [state, setState] = useState({});
  const [option, setOption] = useState({});
  const [optionValue, setOptionValue] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData]=useState({})
  
  const handelChange = (e) => {
    let category = data.categories.find((item) => item.id == e.target.value);
    setCategory(category);
    let subCategory = category.children;
    setSubCategory([...subCategory]);
  };

  const handelsubChange = async (e) => {
    let subCatItem = subCategory.find((item) => item.id == e.target.value);
    setSubCategorySelected(subCatItem);
    const response = await fetch(
      `https://staging.mazaady.com/api/v1/properties?cat=${e.target.value}`,
      {
        headers: {
          "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16",  
        },
      }
    );
    const { data } = await response.json();
    setProperties(data);
  };

  const onProperitesChange = async (e) => {
    const { name, value } = e.target;
    if (value === "other") {
      setState({
        ...state,
        [name]: value,
      });
    } else {
      let options = properites.find((item) => item.name == name)?.options;
      let option = options.find((option) => option.id == value);
      setState({
        ...state,
        [name]: option.name,
      });
      if (option.child) {
        getOptionsDropdown(option);
      }
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const getOptionsDropdown = async (opt) => {
    const response = await fetch(
      `https://staging.mazaady.com/api/v1/get-options-child/${opt.id}`,
      {
        headers: {
          "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16", 
        },
      }
    );
    const { data } = await response.json();
    let name = data[0].name;
    let options = {
      ...option,
      [name]: {
        ...data[0],
      },
    };
    setOption(options);
  };
  const onOptionChange = (e) => {
    let item = JSON.parse(e.target.value);
    let parent = Object.values(option).find((i) => i.id == item.parent);

    setOptionValue({
      ...optionValue,
      [parent.name]: item.name,
    });
    if (item.child) {
      getOptionsDropdown(item);
    }
  };

  useEffect(() => {
    setProperties([]);
    setState({});
    setOption({});
  }, [JSON.stringify(categorySelected)]);

  const submit = () => {
    const data = {
      Category: categorySelected.name,
      SubCategory: subCategorySelected.name,
      ...state,
      ...optionValue,
      ...inputValue,
    };
    console.log(data);
    setTableData(data)
  };
  return (
    <section>
      <div className="main">
        <div className="mb-4">
          <p className="mb-4">Main Category</p>
          <Form.Select
            onChange={handelChange}
            aria-label="Default select example"
          >
            <option>select category</option>

            {data.categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Form.Select>
        </div>
        {/* ============= */}

        <div className="mb-4">
          {subCategory.length > 0 && (
            <>
              <p className="mb-4">Sub Category</p>
              <Form.Select
                aria-label="Default select example"
                onChange={handelsubChange}
              >
                <option>select subcategory</option>

                {subCategory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Select>
            </>
          )}
        </div>

        {/* ========= */}

        <div className="mb-4">
          {properites.length > 0 &&
            properites.map(
              (item) =>
                item.options.length > 0 && (
                  <div className="mb-4" key={item.id}>
                    <p className="mb-4">{item.name}</p>
                    <Form.Select
                      aria-label="Default select example"
                      name={item.name}
                      onChange={onProperitesChange}
                    >
                      <option>select properites</option>

                      {item.options.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}

                      <option key={-1} value="other">
                        other
                      </option>
                    </Form.Select>

                    <div className="mb-4 mt-4">
                      {state[item.name] == "other" && (
                        <Form.Control
                          type="text"
                          placeholder="from user"
                          name={item.name}
                          value={inputValue[item.name]}
                          onChange={onInputChange}
                        
                        />
                      )}
                    </div>
                  </div>
                )
            )}
        </div>

        {/* ========= */}

        <div className="mb-4 ">
          {Object.keys(option).length > 0 &&
            Object.values(option).map((item) => (
              <div className="mb-4" key={item.id}>
                <p className="mb-4">{item.name}</p>
                <Form.Select
                  aria-label="Default select example"
                  name={item.name}
                  onChange={onOptionChange}
                >
                  <option>select option</option>
                  {item.options.map((item) => (
                    <option key={item.id} value={JSON.stringify(item)}>
                      {item.name}
                    </option>
                  ))}
                </Form.Select>
              </div>
            ))}
        </div>
        <button className="btn btn-primary" style={{width: '100%'}} onClick={submit}> Submit</button>
      </div>
      <Taple  tableData={tableData && tableData}/>
    </section>
  );
}

export async function getServerSideProps() {
  // Fetch data from an API or other sources
  const response = await fetch(
    "https://staging.mazaady.com/api/v1/get_all_cats",
    {
      headers: {
        "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16", 
      },
    }
  );
  const { data } = await response.json();

  return {
    props: {
      data,
    },
  };
}

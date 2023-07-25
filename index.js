import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
export default function Home({ data }) {
  const [categorySelected, setCategory] = useState(null)
  const [subCategory, setSubCategory] = useState([]);
  const [subCategorySelected, setSubCategorySelected] = useState([]);
  const [properites, setProperties] = useState([]);
  const [state, setState] = useState({});
  const [option, setOption] = useState({});
  const [optionValue, setOptionValue] = useState({});
  const [inputValue, setInputValue] = useState({})
  const handelChange = (e) => {
    let category = data.categories.find((item) => item.id == e.target.value);
    setCategory(category)
    let subCategory = category.children;
    setSubCategory([...subCategory]);
  };

  const handelsubChange = async (e) => {
    let subCatItem = subCategory.find(item => item.id == e.target.value); 
    setSubCategorySelected(subCatItem)
    const response = await fetch(
      `https://staging.mazaady.com/api/v1/properties?cat=${e.target.value}`,
      {
        headers: {
          "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16", // Add your custom headers here
        },
      }
    );
    const { data } = await response.json();
    setProperties(data);
  };

  const onProperitesChange = async (e) => {
    const { name, value } = e.target;
    if(value === 'other') {
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
      if(option.child) {
        getOptionsDropdown(option)
      }
    }

  }

 const  onInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    })
  }

  const getOptionsDropdown = async (opt) => {
    const response = await fetch(
      `https://staging.mazaady.com/api/v1/get-options-child/${opt.id}`,
      {
        headers: {
          "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16", // Add your custom headers here
        },
      }
    );
    const { data } = await response.json();
    let name = data[0].name;
    let options = {...option,
      [name]: {
       ... data[0]
      }
    }
    setOption(options);
  }
  const onOptionChange = (e) => {
    let item = JSON.parse(e.target.value);
    let parent = Object.values(option).find(i => i.id == item.parent);

    setOptionValue({
      ...optionValue,
      [parent.name]: item.name
    })
    if(item.child) {
        getOptionsDropdown(item)
    }
  }

  useEffect(() => {
    setProperties([]);
    setState({});
    setOption({})

  },[JSON.stringify(categorySelected)])

  const submit = () => {
    const data = {Category: categorySelected.name, SubCategory: subCategorySelected.name, ...state,...optionValue,... inputValue };
    console.log(data)

  }
  return (
    <>
      <div>
        <p>Main Category</p>
        <select onChange={handelChange}>
          <option disabled selected>
            select category
          </option>

          {data.categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <br />
        {subCategory.length > 0 && (
          <>
            <p>Sub Category</p>
            <select onChange={handelsubChange}>
              {subCategory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </>
        )}
        <br />
        {properites.length > 0 &&
          properites.map(
            (item) =>
              item.options.length > 0 && (
                <div key={item.id}>
                  <p>{item.name}</p>
                  <select name={item.name} onChange={onProperitesChange}>
                    {item.options.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}

                    <option key={-1} value="other">
                      other
                    </option>
                  </select>
                  {state[item.name] == "other" && (
                    <input
                      type="text"
                      defaultValue="from user"
                      name={item.name}
                      value=""
                      onChange={onInputChange}
                    />
                  )}
                </div>
              )
          )}
          {
            Object.keys(option).length > 0 && 
            Object.values(option).map(item => 
              <div key={item.id}>
              <p>{item.name}</p>
              <select name={item.name} onChange={onOptionChange}>
                {item.options.map((item) => (
                  <option key={item.id} value={JSON.stringify(item)}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
              
              
              )
          }
      </div>
      <div onClick={submit}> Submit</div>
    </>
  );
}

export async function getServerSideProps() {
  // Fetch data from an API or other sources
  const response = await fetch(
    "https://staging.mazaady.com/api/v1/get_all_cats",
    {
      headers: {
        "private-key": "3%o8i}_;3D4bF]G5@22r2)Et1&mLJ4?$@+16", // Add your custom headers here
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

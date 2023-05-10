import React from "react";
import { database, tableHeader } from "./mock";
import "./index.css";

let base = database;
export class CRUD extends React.Component {
  constructor() {
    super();
    this.state = {
      students: base, 
      active: "search", // Search or Add option is active
      sortedValue: "id", // For sort
      selectedElement: null, // For edit
    };
  }

  render() {
    let { students, active, sortedValue, selectedElement } = this.state;

    // Delete
    const deleteUser = (id) => {
      base = base.filter((student) => student.id !== id);
      this.setState({ students: base });
    };

    // Stars for switch add search
    const searchOrAdd = ({ target: { value } }) => {
      this.setState({ active: value });
      if (value === "add") {
        this.setState({ students: base });
      }
    };

    // Input for searching and adding element
    const searchUserInput = ({ target: { value } }) => {
      this.setState({ newName: value });
      if (active === "search") {
        let result = base.filter(
          (data) =>
            data.name.toLowerCase().includes(value.toLowerCase()) ||
            data.phone.toLowerCase().includes(value.toLowerCase()) ||
            data.location.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({ students: result });
      }
    };

    // Functions for adding element
    function* idGenerator() {
      let length = students.length;
      while (true) {
        yield ++length;
      }
    }
    const addUser = () => {
      if (typeof this.state.newName !== "undefined") {
        if (this.state.newName.trimStart().length > 0) {
          base = [
            ...base,
            {
              id: idGenerator().next().value,
              name: this.state.newName,
              phone: "+998907292677",
              location: "Tashkent",
              delete: "Delete",
              edit: "Edit",
            },
          ];
          this.setState({ students: base, newName: "" });
        }
      }
    };

		// Function for sorting
    const sort = ({ target: { value } }) => {
      let filtered = students.sort((a, b) =>
        `${a[value]}`.localeCompare(`${b[value]}`)
      );
      this.setState({ students: filtered });
    };

		// Functions for editing user 
    const edit = (data) => {
      this.setState({ selectedElement: data });
    };
    const cancel = () => {
      this.setState({ selectedElement: null });
    };
    const save = () => {
			base = base.map(student => {
				return student.id === selectedElement.id ? selectedElement : student
			})
			this.setState({students: base, selectedElement: null})
		};
    const editedValue = (data, key, { target: { value } }) => {
      this.setState({
        selectedElement: {
          ...data,
          ...this.state.selectedElement,
          [key]: value,
        },
      });
    };

    // Rendering HTML
    return (
      <div className="container">
        <header className="header">
          <input
            onChange={(event) => {
              searchUserInput(event);
            }}
            type="text"
            placeholder="Type to search"
            value={this.state.newName}
          />
          <select name="" id="" onChange={searchOrAdd}>
            <option value="search">Search</option>
            <option value="add">Add</option>
          </select>

          {active === "add" ? <button onClick={addUser}>Add</button> : null}

          <div className="filter">
            <h2>Filter:</h2>
            <select name="" id="" onChange={sort}>
              <option value="id">Id</option>
              <option value="name">Name</option>
              <option value="location">Location</option>
              <option value="phone">Phone</option>
            </select>
          </div>
        </header>

        <main className="table">
          <header className="table_header">
            {tableHeader.map((key) => {
              return (
                <div className="table_header-column">
                  <h2>{key}</h2>
                </div>
              );
            })}
          </header>
          <main className="table_content">
            {students.map((data) => {
              return (
                <div className="table_row">
                  {Object.keys(data).map((key) => {
                    if (key !== "delete" && key !== "edit") {
                      if (selectedElement?.id === data.id && key !== "id") {
                        return (
                          <div className="column">
                            <input
                              type="text"
                              defaultValue={data[key]}
                              onChange={(e) => editedValue(data, key, e)}
                            />
                          </div>
                        );
                      }
                      return <div className="column">{data[key]}</div>;
                    } else if (key === "delete") {
                      return (
                        <div className="column">
                          <button onClick={() => deleteUser(data.id)}>
                            {data[key]}
                          </button>
                        </div>
                      );
                    } else if (
                      key === "edit" &&
                      selectedElement?.id === data.id
                    ) {
                      return (
                        <div className="column">
                          <button onClick={save}>Save</button>
                          <button onClick={cancel}>Cancel</button>
                        </div>
                      );
                    } else if (key === "edit") {
                      return (
                        <div className="column">
                          <button onClick={() => edit(data)}>
                            {data[key]}
                          </button>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })}
          </main>
        </main>
      </div>
    );
  }
}

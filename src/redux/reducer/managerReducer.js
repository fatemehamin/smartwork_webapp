import {
  LOADED_MANAGER,
  LOADING_MANAGER,
  ERROR_MANAGER,
  GET_EMPLOYEE,
  ADD_EMPLOYEE,
  DELETE_EMPLOYEE,
  ADD_PROJECT,
  GET_PROJECT,
  DELETE_PROJECT,
  ADD_PROJECT_TO_EMPLOYEE,
  DELETE_PROJECT_FROM_EMPLOYEE,
  TOGGLE_EXCEL,
  ADD_LOCATION,
  DELETE_LOCATION,
  GET_LOCATION,
  EXPORT_EXCEL_REPORT,
  ADD_LOCATION_TO_EMPLOYEE,
  GET_EMPLOYEE_LOCATION,
  DELETE_LOCATION_FROM_EMPLOYEE,
} from '../action/actionType';

const initialState = {
  employees: [],
  projects: [],
  isLoading: true,
  isError: false,
  error: null,
  report: null,
  locations: [],
  isLoadingAccessExcel: false,
};

export default (preState = initialState, action) => {
  switch (action.type) {
    case LOADING_MANAGER: {
      return action.payload != null
        ? {
            ...preState,
            isLoading: true,
            isError: false,
            error: null,
            // report: null,
            ['isLoading' + action.payload.typeError]: true,
          }
        : {
            ...preState,
            isLoading: true,
            isError: false,
            error: null,
          };
    }
    case LOADED_MANAGER: {
      return action.payload != null
        ? {
            ...preState,
            isLoading: false,
            isError: false,
            error: null,
            ['isLoading' + action.payload.typeError]: false,
          }
        : {
            ...preState,
            isLoading: false,
            isError: false,
            error: null,
          };
    }
    case ERROR_MANAGER: {
      return action.payload != null
        ? {
            ...preState,
            isLoading: false,
            isError: true,
            report: null,
            error: {...preState.error, ...action.payload},
            ['isLoading' + action.payload.typeError]: false,
          }
        : {
            ...preState,
            isLoading: false,
            isError: true,
            report: null,
            error: {...preState.error, ...action.payload},
          };
    }
    case GET_EMPLOYEE: {
      return {
        ...preState,
        employees: action.payload,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case ADD_EMPLOYEE: {
      return {
        ...preState,
        employees: [
          ...preState.employees,
          {
            ...action.payload,
            deactive_project: [],
            now_active_project: 'nothing',
            project_list: [],
          },
        ],
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case DELETE_EMPLOYEE: {
      const newEmployee = preState.employees.filter(
        employee => employee.phone_number != action.payload,
      );
      return {
        ...preState,
        employees: newEmployee,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case GET_PROJECT: {
      return {
        ...preState,
        projects: action.payload == 'pdne' ? [] : action.payload,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case ADD_PROJECT: {
      return {
        ...preState,
        projects: [...preState.projects, action.payload],
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case DELETE_PROJECT: {
      const newProjects = preState.projects.filter(
        project => project.project_name !== action.payload,
      );
      const newEmployees = preState.employees.map(employee => {
        return {
          ...employee,
          project_list: employee.project_list.filter(
            pro => pro.project_name != action.payload,
          ),
        };
      });
      return {
        ...preState,
        employees: newEmployees,
        projects: newProjects,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case ADD_PROJECT_TO_EMPLOYEE: {
      const newEmployee = preState.employees.map(employee =>
        employee.phone_number == action.payload.phone_number
          ? {
              ...employee,
              project_list: [
                ...employee.project_list,
                {project_name: action.payload.project_name, sum_duration: ''},
              ],
            }
          : employee,
      );
      return {
        ...preState,
        employees: newEmployee,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case DELETE_PROJECT_FROM_EMPLOYEE: {
      const newEmployee = preState.employees.map(employee => {
        if (employee.phone_number == action.payload.phone_number) {
          const newProjectList = employee.project_list.filter(
            project => project.project_name != action.payload.project_name,
          );
          return {...employee, project_list: newProjectList};
        } else {
          return employee;
        }
      });
      return {...preState, employees: newEmployee};
    }
    case TOGGLE_EXCEL: {
      const newEmployee = preState.employees.map(employee =>
        employee.phone_number == action.payload.phoneNumber
          ? {...employee, financial_group: action.payload.toggleExcel}
          : employee,
      );
      return {
        ...preState,
        employees: newEmployee,
        isLoading: false,
        isError: false,
        error: null,
        ['isLoading' + action.payload.typeError]: false,
      };
    }
    case EXPORT_EXCEL_REPORT: {
      return {...preState, report: action.payload, isLoading: false};
    }
    case GET_LOCATION: {
      return {...preState, locations: action.payload, isLoading: false};
    }
    case ADD_LOCATION: {
      return {
        ...preState,
        locations: [...preState.locations, action.payload],
        isLoading: false,
      };
    }
    case DELETE_LOCATION: {
      const newLocations = preState.locations.filter(
        location => location.location_name != action.payload,
      );
      return {...preState, locations: newLocations, isLoading: false};
    }
    case GET_EMPLOYEE_LOCATION: {
      const newEmployees = preState.employees.map(employee =>
        employee.phone_number == action.payload.phone_number
          ? {
              ...employee,
              location: action.payload.locations,
            }
          : employee,
      );
      return {...preState, employees: newEmployees, isLoading: false};
    }
    case ADD_LOCATION_TO_EMPLOYEE: {
      const location = preState.locations.filter(
        location => location.location_name === action.payload.location_name,
      );
      const newEmployees = preState.employees.map(employee =>
        employee.phone_number == action.payload.phone_number
          ? {
              ...employee,
              location: [...employee.location, location],
            }
          : employee,
      );
      return {...preState, employees: newEmployees, isLoading: false};
    }
    case DELETE_LOCATION_FROM_EMPLOYEE: {
      const newEmployees = preState.employees.map(employee =>
        employee.phone_number == action.payload.phone_number
          ? {
              ...employee,
              location: employee.location.filter(
                location =>
                  location.location_name != action.payload.location_name,
              ),
            }
          : employee,
      );
      return {...preState, employees: newEmployees, isLoading: false};
    }
    default: {
      return preState;
    }
  }
};

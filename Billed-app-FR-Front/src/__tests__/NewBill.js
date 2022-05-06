/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from '../views/BillsUI.js';
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import userEvent from "@testing-library/user-event"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)


// composant views/NewBill :
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
    
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const mailIcon = screen.getByTestId('icon-mail')
      expect(mailIcon.classList.contains('active-icon')).toBe(true)
    })
    
    test("Then the form appear ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      expect(formNewBill).toBeTruthy()
    })
  })
})

describe("When I am on NewBill Page", () => {
  describe("When I upload a file", () => {
    test("Then the file handler should show a file", () => {
      document.body.innerHTML = NewBillUI()
      const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
      const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile, {
          target: {
              files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
          }
      })
      const numberOfFile = screen.getByTestId("file").files.length
      expect(numberOfFile).toEqual(1)
      expect(handleChangeFile).toBeCalled()
    })
  })
})

describe("When I upload a file which is not an image", () => {
  test("Then the error message should be display", async () => {
    document.body.innerHTML = NewBillUI()
    const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
    const handleChangeFile = jest.fn(() => newBill.handleChangeFile)
    const handleSubmit = jest.fn(()=> newBill.handleSubmit)
    const inputFile = screen.getByTestId("file")
    inputFile.addEventListener("change", handleChangeFile)
    fireEvent.change(inputFile, {
        target: {
            files: [new File(["sample.txt"], "sample.txt", { type: "text/txt" })],
        }
    })
    expect(handleChangeFile).toBeCalled()
    expect(handleSubmit).not.toHaveBeenCalled()
    expect(document.querySelector(".error").style.display).toBe("block")
  })
})

// test d'intégration POST new bill.
describe("When I fill inputs in correct format and I click on submit", () => {
  test("Then new bill is added in Bills page", async () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
  
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))

    document.body.innerHTML = NewBillUI()
    const newBill = new NewBill({ document, onNavigate, store: null, localStorage: window.localStorage })
    const submit = screen.getByTestId('form-new-bill')
    const inputData = {
        name: "Forfait Mobile Free",
        date: "2012-01-26",
        type: "téléphone",
        amount: 15.99,
        pct: 10,
        vat: "20",
        com: "voila",
        fileName: "facturefreemobile.jpg",
        fileUrl: "http://127.0.0.1:8080/src/assets/images/facturefreemobile.jpg"
    }

    const handleSubmit = jest.fn((e) => newBill.handleSubmit(e))
      newBill.createBill = (newBill) => newBill

    const inputType = screen.getByTestId("expense-type");
    fireEvent.change(inputType, { target: { value: inputData.type } });
   
    const inputName = screen.getByTestId("expense-name");
    fireEvent.change(inputName, {
      target: { value: inputData.name },
    });

    const inputDate = screen.getByTestId("datepicker");
    fireEvent.change(inputDate, {
      target: { value: inputData.date },
    });

    const inputAmount = screen.getByTestId("amount");
    fireEvent.change(inputAmount, {
      target: { value: inputData.amount },
    });

    const inputVat = screen.getByTestId("vat");
    fireEvent.change(inputVat, {
      target: { value: inputData.vat },
    });

    const inputPct = screen.getByTestId("pct");
    fireEvent.change(inputPct, {
      target: { value: inputData.pct },
    });

    const inputCom = screen.getByTestId("commentary");
    fireEvent.change(inputCom, {
      target: { value: inputData.com },
    });

    newBill.fileUrl = inputData.fileUrl
    newBill.fileName = inputData.fileName 
    submit.addEventListener('click', handleSubmit)
    userEvent.click(submit)
    expect(handleSubmit).toHaveBeenCalled()
    expect(screen.queryByText("Forfait Mobile Free"))
  })
})

  describe("When an error occurs on API", () => {
    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
      Object.defineProperty(
          window,
          'localStorage',
          { value: localStorageMock }
      )
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: "a@a"
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.appendChild(root)
      router()
    })
  test('Add bill to API and fails with 404 message error', async () => {
    mockStore.bills.mockImplementationOnce(() => {
      return {
        update : () =>  {
          return Promise.reject(new Error("Erreur 404"))
        }
      }})

    // build user interface
    const html = BillsUI({
        error: 'Erreur 404'
    });
    document.body.innerHTML = html;

    const message = await screen.getByText(/Erreur 404/);
    // wait for the 404 error message
    expect(message).toBeTruthy();
});

test('Add bill to API and fails with 500 message error', async () => {
  mockStore.bills.mockImplementationOnce(() => {
    return {
      update : () =>  {
        return Promise.reject(new Error("Erreur 500"))
      }
    }})
    // build user interface
    const html = BillsUI({
        error: 'Erreur 500'
    });
    document.body.innerHTML = html;

    const message = await screen.getByText(/Erreur 500/);
    // wait for the 500 error message
    expect(message).toBeTruthy();
})
})


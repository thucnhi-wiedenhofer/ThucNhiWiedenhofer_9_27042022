/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import {screen, waitFor} from "@testing-library/dom"
import Bills from "../containers/Bills"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import userEvent from "@testing-library/user-event"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)

// composant views/Bills :
describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
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
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

describe('When I am on Bills page but it is loading', () => {
  test('Then, Loading page should be rendered', () => {
    document.body.innerHTML = BillsUI({ data: [], loading: true })
    expect(screen.getAllByText('Loading...')).toBeTruthy()
  })
})

describe('When I am on Bills page but back-end send an error message', () => {
  test('Then, Error page should be rendered', () => {
    document.body.innerHTML = BillsUI({ data: [], loading: false, error: 'some error message' })
    expect(screen.getAllByText('Erreur')).toBeTruthy()
  })
})


// Composant container/Bills :
describe('When I click on the New Bill button', () => {
  test('Then, it should render NewBill page', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
  
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    document.body.innerHTML = BillsUI({ data: [] })
    const store = null
      const bills = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      const handleClickNewBill = jest.fn(bills.handleClickNewBill)
      const newBillBtn = screen.getByTestId('btn-new-bill')
      newBillBtn.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillBtn)
      expect(handleClickNewBill).toHaveBeenCalled()
  })
})

describe('Given I am connected as Employee and I am on Bills page', () => {
describe('When I click on the icon eye', () => {
  test('A modal should open', () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
  
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    document.body.innerHTML = BillsUI({ data: bills })
    
    const store = null
    const testBill = new Bills({
      document, onNavigate, store, localStorage: window.localStorage
    })
    testBill.handleClickIconEye = jest.fn()
    const eye = screen.getAllByTestId("icon-eye")[0]
    eye.addEventListener('click', testBill.handleClickIconEye)
    userEvent.click(eye)
    const modale = document.querySelector(".modal")
   
    expect(testBill.handleClickIconEye).toBeCalled()
    expect(modale).toBeTruthy()     
  })
})
})

describe('Given I am connected as Employee and I am on Bills page', () => {
  describe('When I click on the icon eye', () => {
    test("A modal should open and this is an image", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
    
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const bill = [{
        "id": "UIUZtnPQvnbFnB0ozvJh",
        "name": "test3",
        "email": "a@a",
        "type": "Services en ligne",
        "vat": "60",
        "pct": 20,
        "commentAdmin": "bon bah d'accord",
        "amount": 300,
        "status": "accepted",
        "date": "2003-03-03",
        "commentary": "",
        "fileName": "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
        "fileUrl": "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3"
      }]

      document.body.innerHTML = BillsUI({ data: bill })
      
      const store = null
      const testBill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      testBill.handleClickIconEye = jest.fn()
      const eye = screen.getAllByTestId("icon-eye")[0]
      eye.addEventListener('click', testBill.handleClickIconEye)
      userEvent.click(eye)
      const modale = document.querySelector(".modal")
     
      expect(testBill.handleClickIconEye).toBeCalled()
      expect(modale).toBeTruthy() 
      const img = screen.findByRole('test')
      expect(img).toBeTruthy()   
    })

    test("A modal should open but there is no image", () => {
      const bill = [{
        "id": "UIUZtnPQvnbFnB0ozvJh",
        "name": "test3",
        "email": "a@a",
        "type": "Services en ligne",
        "vat": "60",
        "pct": 20,
        "commentAdmin": "bon bah d'accord",
        "amount": 300,
        "status": "pending",
        "date": "2003-03-03",
        "commentary": "",
        "fileName": undefined,
        "fileUrl": undefined
      }]

      document.body.innerHTML = BillsUI({ data: bill })
      
      const store = null
      const testBill = new Bills({
        document, onNavigate, store, localStorage: window.localStorage
      })
      testBill.handleClickIconEye = jest.fn()
      const eye = screen.getAllByTestId("icon-eye")[0]
      eye.addEventListener('click', testBill.handleClickIconEye)
      userEvent.click(eye)
      const modale = document.querySelector(".modal")
     
      expect(testBill.handleClickIconEye).toBeCalled()
      expect(modale).toBeTruthy() 
      expect(modale.innerHTML).toContain('')     
    })
  })
  })

// test d'intégration getBills
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills", () => {
    test("fetches bills from mock API GET", async () => {      
      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByRole('heading', { name: /Mes Notes de frais/i }))
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
    })
  })
})

describe("Given I am a user connected as Employee", () => {
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
    test("fetches bills from an API and fails with 404 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 404"))
          }
        }})
      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list : () =>  {
            return Promise.reject(new Error("Erreur 500"))
          }
        }})

      window.onNavigate(ROUTES_PATH.Bills)
      await new Promise(process.nextTick);
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})



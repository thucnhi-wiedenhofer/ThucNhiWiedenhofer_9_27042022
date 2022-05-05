/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
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
      test('Then, it should be an image', () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
      
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        
        document.body.innerHTML = NewBillUI()
        const store = null
          const newBill = new NewBill({
            document, onNavigate, store, localStorage: window.localStorage
          })
          const handleChangeFile = jest.fn(newBill.handleChangeFile)
          const inputFile = screen.getByTestId('file')
          inputFile.addEventListener('click', handleChangeFile)
          userEvent.click(inputFile, {
            target: {
                files: [new File(["file.name.jpg"], "file.name.jpg", { type: "file.name.jpg" })],
            }
        })
          expect(handleChangeFile).toHaveBeenCalled()
          const img = screen.findByRole('test')
          expect(img).toBeTruthy()  
      })
    })    
})
/*
describe("When I upload a file", () => {
  describe("When the file uploaded is not an image", () => {
    test("Then the error message should be display", async () => {
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
      
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = NewBillUI()
        const store = null
          const newBill = new NewBill({
            document, onNavigate, store, localStorage: window.localStorage
          })
          const handleChangeFile = jest.fn(newBill.handleChangeFile)
          const inputFile = screen.getByTestId('file')
          inputFile.addEventListener('click', handleChangeFile)
          userEvent.click(inputFile, {
            target: {
                files: [new File(["file.name.jpg"], "file.name.jpg", { type: "file.name.jpg" })],
            }
        })
          expect(handleChangeFile).toHaveBeenCalled()
          expect(handleSubmit).not.toHaveBeenCalled()
          expect(document.querySelector(".error").style.display).toBe("block")
      })
    })    
})
*/

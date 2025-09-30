import styled from "styled-components";

export const CreditCard = styled.img`
  width: 48px;
  height: 28px;
`;

export const BillingHeading = styled.div`
  font-size: 18px;
  color: #000;
`;

interface iRow {
  unclickable?: boolean;
}
export const Row = styled.div<iRow>`
  display: flex;
  box-shadow: inset 0px -1px 0px #e7e7ed;
  flex: 1;
  width: 100%;
  height: 64px;
  line-height: 64px;
  color: #2e2e2e;
  cursor: ${props => props?.unclickable ? "" : "pointer"};

  & > div:nth-child(1) {
    width: 40px;
    text-align: center;
  }
  & > div:nth-child(2) {
    width: 100px;
    margin-left: 10px;
  }
  & > div:nth-child(3) {
    flex: 1;
    margin-left: 10px;
  }
  & > div:nth-child(4) {
    width: 120px;
    margin-left: 10px;
  }
  & > div:nth-child(5) {
    width: 120px;
    margin-left: 10px;
  }
  & > div:nth-child(6) {
    width: 240px;
    margin-left: 10px;
  }
  & > div:nth-child(7) {
    width: 120px;
    margin-left: 10px;
    text-align: right;
  }
  & > div:nth-child(8) {
    width: 50px;
    display: flex;
    margin-left: 10px;
  }
`;

export const DeleteIcon = styled.img`
  cursor: pointer;
  transition: all 300ms ease;
  margin: auto;
  width: 20px;
  height: 24px;
  &:hover {
    opacity: 0.7;
  }
`;
export const SummaryRow = styled.div`
  color: #2e2e2e;
  & > div:nth-child(1) {
    margin-left: auto;
    width: 250px;
  }
  & > div:nth-child(2) {
    width: 120px;
    text-align: right;
    margin-right: 60px;
  }
`;
export const TotalRow = styled(SummaryRow)`
  color: rgba(0,0,0,.6);
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
`;

export const AddItem = styled.div`
  position: relative;
  right: 12px;
  margin-top: 32px;
  margin-bottom: -70px;
`;

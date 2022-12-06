import { BrowserRouter, Routes, Route } from "react-router-dom";
/************************************************************************* */
/*--------------------------------------------------------------------------------------------
ADMIN
---------------------------------------------------------------------------------------------- */
import DashboardAdmin from "./pages/super-admin-pages/dahboard-admin";
import Users from "./pages/super-admin-pages/users";
import Masters from "./pages/super-admin-pages/Masters";
import Infra from "./pages/super-admin-pages/Infra";
import BulukProducts from "./pages/super-admin-pages/bulk-products";
import Brands from "./pages/super-admin-pages/brands";
import Products from "./pages/super-admin-pages/products";
import Location from "./pages/super-admin-pages/location";
import BagMaster from "./pages/super-admin-pages/bag-master";
import TrayMaster from "./pages/super-admin-pages/tray-master";
import BulkBag from "./pages/super-admin-pages/bulk-bag";
import BulkTray from "./pages/super-admin-pages/bulk-tray";
import AuditBag from "./pages/super-admin-pages/audit-bag-page";
import AddBulkBrand from "./pages/super-admin-pages/add-bulk-brand";
import UsersHistory from "./pages/super-admin-pages/users-history";
import AuditTray from "./pages/super-admin-pages/audit-tray-page";
import ItemTracking from "./pages/super-admin-pages/item-tracking-page";
import Warehouse from "./pages/super-admin-pages/warehouse";
import ReadyForCharging from "./pages/super-admin-pages/ready-for-charging";

/*--------------------------------------------------------------------------------------------
MIS
---------------------------------------------------------------------------------------------- */
import AddDelivery from "./pages/mis-pages/add-delivery";
import AddOrders from "./pages/mis-pages/add-orders";
import AssignToBot from "./pages/mis-pages/assign-to-bot";
import BadDelivery from "./pages/mis-pages/bad-delivery-page";
import Badorders from "./pages/mis-pages/bad-orders-page";
import Delivery from "./pages/mis-pages/delivery";
import OrdersImport from "./pages/mis-pages/orders";
import MisUserDashboard from "./pages/mis-pages/mis-user-dashboard";
import ReconSheet from "./pages/mis-pages/reconsheet";
import UidDownload from "./pages/mis-pages/uic-download";
import RevalidateOrders from "./pages/mis-pages/revalidate-orders-page";
import RevalidateBadDelivery from "./pages/mis-pages/revalidate-bad-delivery-page";
import UicgerateBagwise from "./pages/mis-pages/uic-generate-bagwise";
import TrackDeliveredItem from "./pages/mis-pages/track-delivered-item-page";
import AssignToCharging from "./pages/mis-pages/assign-to-charging";
import AssignToBqc from "./pages/mis-pages/assign-to-bqc";
import AssigntoAudit from "./pages/mis-pages/assign-to-audit";
import BotToWht from "./pages/mis-pages/bot-to-wht";
import AssignForSorting from "./pages/mis-pages/assign-for-sorting";
import ViewItemClubBot from "./pages/mis-pages/view-bot-item-club";
import BotClubDataAssignToWht from "./pages/mis-pages/bot-club-to-wht";
import ViewBotTraySentToSorting from "./pages/mis-pages/bot-sent-to-sorting";
import WhtTrayMerge from "./pages/mis-pages/wht-tray-merge";
import BagTransfer from "./pages/mis-pages/bag-transaction/bag-transfer";
import BagRecive from "./pages/mis-pages/bag-transaction/bag-recieve";
import ViewItemBagTranscation from "./pages/mis-pages/bag-transaction/view-item";
import MmtMerge from "./pages/mis-pages/mmt-merge/mmt-tray";
/*--------------------------------------------------------------------------------------------
BOT
---------------------------------------------------------------------------------------------- */
import BotDashboard from "./pages/bot-page/bot";
import BotBagPage from "./pages/bot-page/bot-bag-page";
import ViewBotAssignedBag from "./pages/bot-page/bot-view-assigned-details";
import ViewAssignedTray from "./pages/bot-page/view-assigned-tray-page";
import TrayDetails from "./pages/bot-page/tray-deails-page";
/*--------------------------------------------------------------------------------------------
WAREHOUSE
---------------------------------------------------------------------------------------------- */
import OrdersSearch from "./pages/warehouse-page/orders-search";
import RequestDetailPage from "./pages/warehouse-page/request-detail-page";
import StockInWarehouse from "./pages/warehouse-page/stock-in-warehouse";
import WarehouseInDashboard from "./pages/warehouse-page/warehouse-in-dashboard";
import TrayCloseRequest from "./pages/warehouse-page/tray-close-page";
import ViewRequest from "./pages/warehouse-page/view-request";
import TrayDetailsPage from "./pages/warehouse-page/tray-view-detail";
import SummeryPageBagBot from "./pages/warehouse-page/summery-bag-bot-page";
import BotTrayClose from "./pages/warehouse-page/bot-tray-close";
import PickList from "./pages/warehouse-page/picklist";
import WhtTrayAssign from "./pages/warehouse-page/wht_tray_assign";
import ViewPickListModelItem from "./pages/warehouse-page/view_item_mode_picklist";
import AllWhtTray from "./pages/warehouse-page/all-wht-tray";
import ViewWhtTrayItem from "./pages/warehouse-page/view-wht-tray-item";
import PickListClose from "./pages/warehouse-page/picklist-close";
import AllPickList from "./pages/warehouse-page/created-picklist";
import ViewPickListItem from "./pages/warehouse-page/view-pick-list-items";
import InuseSorting from "./pages/warehouse-page/in-sorting-wht";
import BotToRelease from "./pages/warehouse-page/bot-release/bot-to-release";
import BotReleaseViewItem from "./pages/warehouse-page/bot-release/view-tray-item";
import ChargingRequestRecieved from "./pages/warehouse-page/charging-request-recieved";
import ChargingRequestApprove from "./pages/warehouse-page/charging-request-approve";
import TraysInChargingWarehouse from "./pages/warehouse-page/trays-in-charging";
import TrayReturnedFromCharging from "./pages/warehouse-page/returning-from-charging";
import ViewChargingDoneItem from "./pages/warehouse-page/view-charging-done-item";
import ReturnChargeDoneClose from "./pages/warehouse-page/return-from-charging/close-tray";
import ViewBqcRequest from "./pages/warehouse-page/bqc-request/view-page";
import ReturnFromBqc from "./pages/warehouse-page/return-from-bqc/view-all-wht";
import ReturnBqcClose from "./pages/warehouse-page/return-from-bqc/close-tray";
import SortingRequests from "./pages/warehouse-page/sorting-requests/view-sorting-requests";
import ViewTrayForSorting from "./pages/warehouse-page/sorting-requests/view-tray-for-sorting";
import ViewActualVsExpected from "./pages/warehouse-page/sorting-requests/ex-vs-act";
import ReturnFromSortingView from "./pages/warehouse-page/return-from-sorting/view-tray";
import ReturnFromSortingClose from "./pages/warehouse-page/return-from-sorting/close-tray";
import IssuedMmtPmtTray from "./pages/warehouse-page/issued-pmt-mmt";
import PmtReport from "./pages/warehouse-page/report/pmt-report";
import MmtReport from "./pages/warehouse-page/report/mmt-report";
import InuseWhtTray from "./pages/warehouse-page/in-use-wht-tray/wht-tray";
import MmttrayMerge from "./pages/warehouse-page/mmt-merge-request/tray-page";
import BotTrayReport from "./pages/warehouse-page/bot-tray-report/view-tray";
import BotTrayItemDetailsReport from "./pages/warehouse-page/bot-tray-report/view-item";
import MmtFromAndToTrayView from "./pages/warehouse-page/mmt-merge-approve/from-and-to-tray";
import ReturnFromMmtMerge from "./pages/warehouse-page/return-from-merge/view-tray";
import ReturnFromMergeMmtTrayClose from "./pages/warehouse-page/return-from-merge/mmt-tray-close";
import InusePmtMmt from "./pages/warehouse-page/inuse-pmt-mmt/inuse-pmt-mmt";
import SkuSummeryBot from "./pages/warehouse-page/bot-tray-report/sku-summery"
/**********************************CHARGING PANEL************************************* */
import ChargingPanelDashboard from "./pages/charging-pages/charging-dashboard";
import ViewAssignedTrayCharging from "./pages/charging-pages/view-assigned-tray";
import ViewDetailsTrayCharging from "./pages/charging-pages/view-details-tray";
import ChargingOut from "./pages/charging-pages/charging-out";
/**********************************BQC PANEL************************************* */
import BqcDashboard from "./pages/bqc-pages/dashboard";
import AssignedTrayBqc from "./pages/bqc-pages/view-assigned-tray";
import BqcIn from "./pages/bqc-pages/bqc-in";
import BqcOut from "./pages/bqc-pages/bqc-out";
/**********************************SORTING AGENT PANEL************************************* */
import SortingAgentDashboard from "./pages/sorting-agent-pages/dashboard";
import ViewAssignedSortingRequests from "./pages/sorting-agent-pages/view-sorting-requests";
import StartSorting from "./pages/sorting-agent-pages/start-sorting";
import ViewAssignedWhtTray from "./pages/sorting-agent-pages/view-assigned-wht";
import ViewAssignedMmt from "./pages/sorting-agent-pages/mmt-merge/view-assigned";
import StartMmtMerge from "./pages/sorting-agent-pages/mmt-merge/start-mmt-merge";
/************************************************************************************** */
import Login from "./pages/Login";
import ChangePassword from "./pages/change-password";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/masters" element={<Masters />} />
          <Route path="/infra" element={<Infra />} />
          <Route path="/orders" element={<OrdersImport />} />
          <Route path="/orders-import" element={<AddOrders />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/delivery-import" element={<AddDelivery />} />
          <Route path="/users" element={<Users />} />
          <Route path="/mis-user-dashboard" element={<MisUserDashboard />} />
          <Route
            path="/warehouse-in-dashboard"
            element={<WarehouseInDashboard />}
          />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products" element={<Products />} />
          <Route path="/location" element={<Location />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/bulk-products" element={<BulukProducts />} />
          <Route path="/recon-sheet" element={<ReconSheet />} />
          <Route path="/search" element={<OrdersSearch />} />
          <Route path="/uic-download" element={<UidDownload />} />
          <Route path="/bag-master" element={<BagMaster />} />
          <Route path="/tray-master" element={<TrayMaster />} />
          <Route path="/assign-to-bot" element={<AssignToBot />} />
          <Route path="/stock-in-warehouse" element={<StockInWarehouse />} />
          <Route path="/bulk-tray" element={<BulkTray />} />
          <Route path="/bulk-bag" element={<BulkBag />} />
          <Route path="/bot-dashboard" element={<BotDashboard />} />
          <Route path="/bag-issue-request" element={<ViewRequest />} />
          <Route
            path="/request-detail-page/:bagId"
            element={<RequestDetailPage />}
          />
          <Route path="/bot-bag-page" element={<BotBagPage />} />
          <Route
            path="/view-assigned-bag/:bagId"
            element={<ViewBotAssignedBag />}
          />
          <Route path="/audit-tab/:bagId" element={<AuditBag />} />
          <Route path="/add-bulk-brand" element={<AddBulkBrand />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/users-history/:username" element={<UsersHistory />} />
          <Route path="/bad-orders" element={<Badorders />} />
          <Route path="/revalidate-orders" element={<RevalidateOrders />} />
          <Route path="/bad-delivery" element={<BadDelivery />} />
          <Route
            path="/revalidate-delivery"
            element={<RevalidateBadDelivery />}
          />
          <Route path="/audit-tray/:trayId" element={<AuditTray />} />
          <Route path="/view-assigned-tray" element={<ViewAssignedTray />} />
          <Route path="/tray-details/:trayId" element={<TrayDetails />} />
          <Route path="/tray-close-request" element={<TrayCloseRequest />} />
          <Route
            path="/tray-view-detail/:trayId"
            element={<TrayDetailsPage />}
          />
          <Route path="/uic-generate/:bagId" element={<UicgerateBagwise />} />
          <Route path="/bot-tray-close" element={<BotTrayClose />} />
          <Route
            path="/summery-bot-bag/:bagId"
            element={<SummeryPageBagBot />}
          />
          <Route
            path="/track-delivered-item"
            element={<TrackDeliveredItem />}
          />
          <Route path="/track-item" element={<ItemTracking />} />
          <Route path="/picklist-request" element={<PickList />} />

          <Route
            path="/picklist-view-detail/:vendor_sku_id/:id"
            element={<ViewPickListModelItem />}
          />
          <Route
            path="/wht-tray-assign/:vendor_sku_id/:id"
            element={<WhtTrayAssign />}
          />
          <Route path="/wht-tray/:type" element={<AllWhtTray />} />
          <Route path="/wht-tray-item/:trayId" element={<ViewWhtTrayItem />} />
          <Route
            path="/pick-list-close/:picklistId"
            element={<PickListClose />}
          />
          <Route path="/all-pick-list" element={<AllPickList />} />
          <Route
            path="/view-pick-list-items/:pickListId"
            element={<ViewPickListItem />}
          />
          <Route path="/in-sorting-wht-tray" element={<InuseSorting />} />
          <Route path="/in-use-wht-tray" element={<InuseWhtTray />} />
          <Route
            path="/charging-dashboard"
            element={<ChargingPanelDashboard />}
          />
          <Route path="/bot-release" element={<BotToRelease />} />
          <Route path="/assign-to-charging" element={<AssignToCharging />} />
          <Route
            path="/charging-request"
            element={<ChargingRequestRecieved />}
          />
          <Route
            path="/request-approve/:trayId"
            element={<ChargingRequestApprove />}
          />
          <Route
            path="/view-assigned-tray-charging"
            element={<ViewAssignedTrayCharging />}
          />
          <Route
            path="/charging-view-tray-details/:trayId"
            element={<ViewDetailsTrayCharging />}
          />
          <Route
            path="/trays-in-charging"
            element={<TraysInChargingWarehouse />}
          />
          <Route
            path="/tray-return-from-charging"
            element={<TrayReturnedFromCharging />}
          />
          <Route path="/charging-out/:trayId" element={<ChargingOut />} />
          <Route
            path="/view-charging-done-item/:trayId"
            element={<ViewChargingDoneItem />}
          />
          <Route
            path="/charge-done-item-verify/:trayId"
            element={<ReturnChargeDoneClose />}
          />
          <Route path="/assign-to-bqc" element={<AssignToBqc />} />
          <Route path="/bqc-dashboard" element={<BqcDashboard />} />
          <Route path="/bqc-request" element={<ViewBqcRequest />} />
          <Route path="/view-assigned-tray-bqc" element={<AssignedTrayBqc />} />
          <Route path="/bqc-in/:trayId" element={<BqcIn />} />
          <Route path="/bqc-out/:trayId" element={<BqcOut />} />
          <Route path="/return-from-bqc" element={<ReturnFromBqc />} />
          <Route
            path="/return-from-bqc-close/:trayId"
            element={<ReturnBqcClose />}
          />
          <Route path="/assign-to-audit" element={<AssigntoAudit />} />
          <Route path="/bot-to-wht" element={<BotToWht />} />
          <Route path="/assign-for-sorting" element={<AssignForSorting />} />
          <Route path="/view-club-item-bot" element={<ViewItemClubBot />} />
          <Route
            path="/bot-club-to-wht-assignment"
            element={<BotClubDataAssignToWht />}
          />
          <Route
            path="/view-sorting-requests"
            element={<ViewBotTraySentToSorting />}
          />
          <Route path="/sorting-requests" element={<SortingRequests />} />
          <Route
            path="/view-tray-for-sorting/:botTrayId"
            element={<ViewTrayForSorting />}
          />
          <Route
            path="/sorting-request-item-verifiy/:trayId"
            element={<ViewActualVsExpected />}
          />
          <Route
            path="/sorting-agent-dashboard"
            element={<SortingAgentDashboard />}
          />
          <Route
            path="/view-assigned-sorting-requests"
            element={<ViewAssignedSortingRequests />}
          />
          <Route path="/start-sorting/:trayId" element={<StartSorting />} />
          <Route
            path="/sorting-view-assigned-wht"
            element={<ViewAssignedWhtTray />}
          />
          <Route
            path="/return-from-sorting"
            element={<ReturnFromSortingView />}
          />
          <Route
            path="/return-from-sorting-close/:trayId"
            element={<ReturnFromSortingClose />}
          />
          <Route
            path="/bot-release-view-item/:trayId"
            element={<BotReleaseViewItem />}
          />
          <Route path="/issued-mmt-pmt" element={<IssuedMmtPmtTray />} />
          <Route path="/pmt-report" element={<PmtReport />} />
          <Route path="/mmt-report" element={<MmtReport />} />
          <Route path="/tray-merge-request" element={<MmttrayMerge />} />
          <Route path="/wht-tray-merge" element={<WhtTrayMerge />} />
          <Route path="/bot-tray-report" element={<BotTrayReport />} />
          <Route path="/bag-transfer" element={<BagTransfer />} />
          <Route path="/bag-receive" element={<BagRecive />} />
          <Route
            path="/view-bag-item/:bagId"
            element={<ViewItemBagTranscation />}
          />
          <Route
            path="/bot-tray-report-details/:trayId/:muic"
            element={<BotTrayItemDetailsReport />}
          />
          <Route path="/mmt-merge" element={<MmtMerge />} />
          <Route
            path="/mmt-merge-approve/:mmtTrayId"
            element={<MmtFromAndToTrayView />}
          />
          <Route path="/tray-merge" element={<ViewAssignedMmt />} />
          <Route path="/start-mmt-merge/:trayId" element={<StartMmtMerge />} />
          <Route
            path="/tray-return-from-merging"
            element={<ReturnFromMmtMerge />}
          />
          <Route
            path="/tray-return-from-merging-close/:trayId"
            element={<ReturnFromMergeMmtTrayClose />}
          />
          <Route path="/ready-for-charging" element={<ReadyForCharging />} />
          <Route path="/inuse-pmt-mmt" element={<InusePmtMmt />} />
          <Route path="/bot-sku-summery/:trayId" element={<SkuSummeryBot />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

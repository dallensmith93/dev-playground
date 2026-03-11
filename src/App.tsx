import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import StartupRoaster from "./pages/StartupRoaster";
import CommitGenerator from "./pages/CommitGenerator";
import InterviewChaos from "./pages/InterviewChaos";
import DeveloperPersonality from "./pages/DeveloperPersonality";
import CodingExcuse from "./pages/CodingExcuse";
import LayoffCalculator from "./pages/LayoffCalculator";
import BuzzwordTranslator from "./pages/BuzzwordTranslator";
import SideProjectValidator from "./pages/SideProjectValidator";
import RubberDuckDebugger from "./pages/RubberDuckDebugger";
import StackOverflowGenerator from "./pages/StackOverflowGenerator";
import BuzzwordBingo from "./pages/BuzzwordBingo";
import CssInsultGenerator from "./pages/CssInsultGenerator";
import JobDescriptionChecker from "./pages/JobDescriptionChecker";
import AtsScoreCheck from "./pages/AtsScoreCheck";
import GraphQLExplorer from "./pages/GraphQLExplorer";
import GithubDevDashboard from "./pages/GithubDevDashboard";
import ApiLatencyVisualizer from "./pages/ApiLatencyVisualizer";
import PixelPerfectChecker from "./pages/PixelPerfectChecker";
import MobileLayoutSimulator from "./pages/MobileLayoutSimulator";
import TestingPlayground from "./pages/TestingPlayground";
import RegexPlayground from "./pages/RegexPlayground";
import JsonFormatter from "./pages/JsonFormatter";
import ApiRequestBuilder from "./pages/ApiRequestBuilder";
import JwtDecoder from "./pages/JwtDecoder";
import CssLayoutGenerator from "./pages/CssLayoutGenerator";
import ColorPaletteGenerator from "./pages/ColorPaletteGenerator";
import ShareToolResult from "./pages/ShareToolResult";
import { routes } from "./constants/routes";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path={routes.home} element={<Home />} />
        <Route path={routes.startupRoaster} element={<StartupRoaster />} />
        <Route path={routes.commitGenerator} element={<CommitGenerator />} />
        <Route path={routes.interviewChaos} element={<InterviewChaos />} />
        <Route path={routes.developerPersonality} element={<DeveloperPersonality />} />
        <Route path={routes.codingExcuse} element={<CodingExcuse />} />
        <Route path={routes.layoffCalculator} element={<LayoffCalculator />} />
        <Route path={routes.buzzwordTranslator} element={<BuzzwordTranslator />} />
        <Route path={routes.sideProjectValidator} element={<SideProjectValidator />} />
        <Route path={routes.rubberDuckDebugger} element={<RubberDuckDebugger />} />
        <Route path={routes.stackOverflowGenerator} element={<StackOverflowGenerator />} />
        <Route path={routes.buzzwordBingo} element={<BuzzwordBingo />} />
        <Route path={routes.cssInsultGenerator} element={<CssInsultGenerator />} />
        <Route path={routes.jobDescriptionChecker} element={<JobDescriptionChecker />} />
        <Route path={routes.atsScoreCheck} element={<AtsScoreCheck />} />
        <Route path={routes.graphQLExplorer} element={<GraphQLExplorer />} />
        <Route path={routes.githubDevDashboard} element={<GithubDevDashboard />} />
        <Route path={routes.apiLatencyVisualizer} element={<ApiLatencyVisualizer />} />
        <Route path={routes.pixelPerfectChecker} element={<PixelPerfectChecker />} />
        <Route path={routes.mobileLayoutSimulator} element={<MobileLayoutSimulator />} />
        <Route path={routes.testingPlayground} element={<TestingPlayground />} />
        <Route path={routes.regexPlayground} element={<RegexPlayground />} />
        <Route path={routes.jsonFormatter} element={<JsonFormatter />} />
        <Route path={routes.apiRequestBuilder} element={<ApiRequestBuilder />} />
        <Route path={routes.jwtDecoder} element={<JwtDecoder />} />
        <Route path={routes.cssLayoutGenerator} element={<CssLayoutGenerator />} />
        <Route path={routes.paletteGenerator} element={<ColorPaletteGenerator />} />
        <Route path={routes.shareToolResult} element={<ShareToolResult />} />
        <Route path="*" element={<Navigate to={routes.home} replace />} />
      </Routes>
    </Layout>
  );
}

import type { ApprovalActionsMode, ApprovalReviewStatus } from './approval-actions.component';
interface Case { readonly name: string; readonly appearance: 'light'|'dark'; readonly viewport: 'desktop'|'mobile'; readonly mode: ApprovalActionsMode; readonly status: ApprovalReviewStatus; readonly warnings: boolean; }
export const approvalActionsVisualCases: readonly Case[] = [
 { name:'pending-sticky-light-desktop',appearance:'light',viewport:'desktop',mode:'sticky',status:'pending',warnings:true },
 { name:'approved-contained-dark-desktop',appearance:'dark',viewport:'desktop',mode:'contained',status:'approved',warnings:false },
 { name:'rejected-sticky-light-mobile',appearance:'light',viewport:'mobile',mode:'sticky',status:'rejected',warnings:false },
 { name:'changes-contained-dark-mobile',appearance:'dark',viewport:'mobile',mode:'contained',status:'changes-requested',warnings:true },
];
describe('approval actions visual coverage',()=>{it('covers appearance, widths, modes, statuses, and warnings',()=>{
 expect(new Set(approvalActionsVisualCases.map(x=>x.appearance))).toEqual(new Set(['light','dark'])); expect(new Set(approvalActionsVisualCases.map(x=>x.viewport))).toEqual(new Set(['desktop','mobile']));
 expect(new Set(approvalActionsVisualCases.map(x=>x.mode))).toEqual(new Set(['sticky','contained'])); expect(new Set(approvalActionsVisualCases.map(x=>x.status))).toEqual(new Set(['pending','approved','rejected','changes-requested'])); expect(new Set(approvalActionsVisualCases.map(x=>x.warnings))).toEqual(new Set([true,false]));
});});

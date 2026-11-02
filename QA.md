# Launch QA results

Run on 2 November 2026 with `tests/scoring.test.js` and `tests/browser.test.js`.
**All automated checks pass:** 518,065 scoring answer sets and 152 browser checks.

These ran in Chromium with phone emulation. **They have not been run in real Safari
or on a physical iPhone**, so item 1 still needs a hands-on pass.

| # | Checklist item | Result |
|---|---|---|
| 1 | Homepage and calculator on common iPhone and screen sizes | Passed in emulation at 320, 360, 375, 390, 430, 768 and 1440px: no sideways scrolling, no script errors. **Real iPhone still to do** |
| 2 | Buttons easy to tap, text readable without zooming | Answer buttons, tracker days and controls are at least 44px on phones; all text is at least 14px; form fields are 16px or larger, so iPhones won't auto-zoom. Fine print links in the footer are the exception |
| 3 | Progress indicator and result screen on mobile | Progress stays visible while scrolling and counts answers out of 18; results render at every size |
| 4 | Every answer combination and the scoring logic | 18 questions with 11 options each cannot literally all be tried. Tested instead: every value on every question, every pair of dimension scores, 500,000 random forms, each compared with the published formula |
| 5 | Empty answers, refreshes, back navigation, repeated attempts | Empty and spaces-only goals rejected; unanswered questions blocked and highlighted; refresh keeps progress and results; browser Back and Forward work; URL skipping blocked; editing an answer doesn't create a duplicate; corrupt or blocked browser storage doesn't break the check |
| 6 | Same results for identical inputs | Confirmed in code and across two separate browser sessions |

## Bugs this found and fixed

- A score displayed as 80 could still show the band for 79.
- Score and Resistance could add up to 101.
- A flat set of answers named the same dimension as both strongest and biggest blocker.
- All zeros praised a strongest dimension; all tens reported a blocker costing 0 points.
- Follow-up comparisons mixed different goals.
- Refreshing, or pressing the browser's Back button, lost the whole check.
- On phones, pressing Next left you at the bottom of the new step.
- Answer buttons were about 29px wide on an iPhone 14.
- The Results page's WhatsApp button had no link to the person's result.

## Before launch, by hand

- [ ] Run the whole check on a real iPhone in Safari
- [ ] Download the report on that iPhone and open it
- [ ] Send one WhatsApp message from the results page and confirm it arrives

# ✅ Feature Added: "Add More Documents" Button

## What Was Added

### 1. **New Button in Document Sidebar**
- Location: Below the document list in the left sidebar
- Appears only when there are documents uploaded
- Styled with purple theme and crown icon

### 2. **Visual Design**
```
┌─────────────────────────────┐
│ 📁 Documents (3)           │
│                            │
│ ┌─────────────────────────┐│
│ │ Document 1              ││
│ └─────────────────────────┘│
│ ┌─────────────────────────┐│
│ │ Document 2              ││
│ └─────────────────────────┘│
│ ┌─────────────────────────┐│
│ │ Document 3              ││
│ └─────────────────────────┘│
│                            │
│ ┌─────────────────────────┐│
│ │ + Add More Documents 👑 ││ <- NEW BUTTON
│ └─────────────────────────┘│
└─────────────────────────────┘
```

### 3. **Button Features**
- **Icon**: Plus (+) on left, Crown (👑) on right
- **Style**: Dashed purple border
- **Hover**: Subtle purple background glow
- **Action**: Opens "Upgrade Plan" popup dialog

### 4. **Popup Dialog**
When clicked, shows the existing `SubscriptionDialog` with:
- ✅ Upgrade tab with premium features
- ✅ Sign In tab for existing users
- ✅ Premium benefits listed
- ✅ Upgrade button with pricing

## Code Changes

### Files Modified:
1. `src/pages/Index.tsx`

### Changes Made:
```tsx
// Added imports
import { Plus, Crown } from 'lucide-react';
import { SubscriptionDialog } from '@/components/SubscriptionDialog';
import { Button } from '@/components/ui/button';

// Added state
const [showSubscription, setShowSubscription] = useState(false);

// Added button in sidebar
{documents.length > 0 && (
  <Button
    onClick={() => setShowSubscription(true)}
    variant="outline"
    className="w-full mt-3 border-dashed border-2 border-purple-500/30..."
  >
    <Plus className="w-4 h-4 mr-2" />
    Add More Documents
    <Crown className="w-3 h-3 ml-2 text-purple-500" />
  </Button>
)}

// Added dialog at bottom
<SubscriptionDialog 
  open={showSubscription} 
  onOpenChange={setShowSubscription} 
/>
```

## User Flow

1. **User uploads document(s)** → Documents appear in sidebar
2. **"Add More Documents" button appears** below document list
3. **User clicks button** → Popup opens
4. **Popup shows**: "Upgrade to Premium" message with benefits
5. **User can**:
   - Click "Upgrade Now" (would go to payment)
   - Switch to "Sign In" tab
   - Close popup to continue free tier

## Visual Styling

### Button States:
- **Default**: Purple dashed border, white background
- **Hover**: Purple glow, stronger border
- **Active**: Subtle scale animation

### Colors:
- Border: `purple-500/30` → `purple-500/50` on hover
- Text: `purple-600` → `purple-700` on hover
- Background: Transparent → `purple-500/5` on hover

## Benefits

✅ **User Engagement**: Encourages users to upgrade
✅ **Non-intrusive**: Only shows when documents exist
✅ **Clear CTA**: Crown icon indicates premium feature
✅ **Smooth UX**: Uses existing subscription dialog component
✅ **Consistent Design**: Matches overall purple theme

## Testing

### To Test:
1. Upload at least 1 document (PDF or URL)
2. Check sidebar - button should appear below documents
3. Click "Add More Documents" button
4. Verify popup opens with upgrade options
5. Click outside or close to dismiss popup

### Expected Behavior:
- ✅ Button only visible when documents.length > 0
- ✅ Button opens subscription dialog
- ✅ Dialog shows upgrade features
- ✅ Can close dialog and continue using app

## Screenshots Location
Look for the button in the left sidebar, below the document cards!

---

**Status**: ✅ Complete and Ready to Test
**Next Step**: Test locally, then commit and push to GitHub

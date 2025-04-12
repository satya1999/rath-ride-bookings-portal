
import AdminLayout from "@/components/layout/AdminLayout";
import { BusLayoutUploader } from "@/components/admin/bus/BusLayoutUploader";
import { BusLayoutsTable } from "@/components/admin/bus/BusLayoutsTable";
import { BusLayoutPageHeader } from "@/components/admin/bus/BusLayoutPageHeader";
import { BusLayoutInfoPanel } from "@/components/admin/bus/BusLayoutInfoPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBusLayouts } from "@/hooks/useBusLayouts";

const BusLayoutsPage = () => {
  const { 
    busLayouts, 
    handleAddLayout, 
    handleLayoutDelete, 
    handleLayoutUpdate,
    handleLayoutAdded 
  } = useBusLayouts();

  return (
    <AdminLayout>
      <BusLayoutPageHeader onAddLayout={handleAddLayout} />

      <Tabs defaultValue="layouts" className="w-full mb-6">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="layouts">All Layouts</TabsTrigger>
          <TabsTrigger value="upload">Upload New Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layouts" className="mt-6">
          <BusLayoutsTable 
            layouts={busLayouts} 
            onDelete={handleLayoutDelete}
            onUpdate={handleLayoutUpdate}
          />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <BusLayoutUploader onLayoutAdded={handleLayoutAdded} />
            <BusLayoutInfoPanel />
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default BusLayoutsPage;

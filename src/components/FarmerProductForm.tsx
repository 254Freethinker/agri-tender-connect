
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface FarmerProductFormProps {
  onSubmit?: (productData: any) => void;
}

const FarmerProductForm: React.FC<FarmerProductFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    quality: 'Grade A',
    isOrganic: false,
    certifications: [],
    harvestDate: '',
    description: '',
    handlingPractices: '',
    storageConditions: '',
    images: [],
    price: '',
    location: '',
    availableFrom: '',
    availableTo: ''
  });

  const [qualityDetails, setQualityDetails] = useState({
    sizeUniformity: '',
    colorUniformity: '',
    defects: '',
    cleanlinessLevel: '',
    packagingType: ''
  });

  const categories = [
    'Cereals',
    'Legumes',
    'Cash Crops',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Meat'
  ];

  const qualities = [
    'Grade A (Premium)',
    'Grade B (Standard)',
    'Grade C (Economy)'
  ];

  const certifications = [
    { id: 'organic', label: 'Organic Certified' },
    { id: 'kebs', label: 'KEBS Certified' },
    { id: 'export', label: 'Export Quality' },
    { id: 'gmp', label: 'Good Manufacturing Practices' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQualityDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (certification: string) => {
    setProductData(prev => {
      const current = prev.certifications as string[];
      if (current.includes(certification)) {
        return { ...prev, certifications: current.filter(c => c !== certification) };
      } else {
        return { ...prev, certifications: [...current, certification] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine product data with quality details
    const completeProductData = {
      ...productData,
      qualityDetails,
      submittedAt: new Date()
    };
    
    // You would typically send this to an API
    console.log('Product submission:', completeProductData);
    
    if (onSubmit) {
      onSubmit(completeProductData);
    }
    
    toast({
      title: "Product Added Successfully",
      description: "Your product has been added to the marketplace.",
    });
    
    // Reset form
    setProductData({
      name: '',
      category: '',
      quantity: '',
      unit: 'kg',
      quality: 'Grade A',
      isOrganic: false,
      certifications: [],
      harvestDate: '',
      description: '',
      handlingPractices: '',
      storageConditions: '',
      images: [],
      price: '',
      location: '',
      availableFrom: '',
      availableTo: ''
    });
    
    setQualityDetails({
      sizeUniformity: '',
      colorUniformity: '',
      defects: '',
      cleanlinessLevel: '',
      packagingType: ''
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Add Your Agricultural Product</CardTitle>
        <CardDescription>
          Provide detailed information about your product to help buyers assess its quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={productData.name} 
                  onChange={handleChange} 
                  placeholder="e.g., Fresh Tomatoes" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={productData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  value={productData.quantity} 
                  onChange={handleChange} 
                  placeholder="Amount" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={productData.unit} 
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="tonnes">Tonnes</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="crates">Crates</SelectItem>
                    <SelectItem value="bags">Bags</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (KES per unit)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={productData.price} 
                  onChange={handleChange} 
                  placeholder="e.g., 150" 
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date</Label>
                <Input 
                  id="harvestDate" 
                  name="harvestDate" 
                  type="date" 
                  value={productData.harvestDate} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={productData.location} 
                  onChange={handleChange} 
                  placeholder="e.g., Nakuru County" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={productData.description} 
                onChange={handleChange} 
                placeholder="Describe your product in detail" 
                rows={3} 
                required 
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quality Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="quality">Quality Grade</Label>
              <Select 
                value={productData.quality} 
                onValueChange={(value) => handleSelectChange('quality', value)}
              >
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Select quality grade" />
                </SelectTrigger>
                <SelectContent>
                  {qualities.map((quality) => (
                    <SelectItem key={quality} value={quality}>
                      {quality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sizeUniformity">Size Uniformity</Label>
                <Select 
                  value={qualityDetails.sizeUniformity} 
                  onValueChange={(value) => setQualityDetails(prev => ({ ...prev, sizeUniformity: value }))}
                >
                  <SelectTrigger id="sizeUniformity">
                    <SelectValue placeholder="Select uniformity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-uniform">Very Uniform</SelectItem>
                    <SelectItem value="mostly-uniform">Mostly Uniform</SelectItem>
                    <SelectItem value="somewhat-varied">Somewhat Varied</SelectItem>
                    <SelectItem value="mixed-sizes">Mixed Sizes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="defects">Defects</Label>
                <Select 
                  value={qualityDetails.defects} 
                  onValueChange={(value) => setQualityDetails(prev => ({ ...prev, defects: value }))}
                >
                  <SelectTrigger id="defects">
                    <SelectValue placeholder="Select defect level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None to Very Few</SelectItem>
                    <SelectItem value="minor">Minor Defects</SelectItem>
                    <SelectItem value="moderate">Moderate Defects</SelectItem>
                    <SelectItem value="significant">Significant Defects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Certifications & Standards</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {certifications.map((certification) => (
                  <div className="flex items-center space-x-2" key={certification.id}>
                    <Checkbox 
                      id={certification.id} 
                      checked={(productData.certifications as string[]).includes(certification.id)}
                      onCheckedChange={() => handleCheckboxChange(certification.id)}
                    />
                    <Label htmlFor={certification.id} className="font-normal">
                      {certification.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="handlingPractices">Post-Harvest Handling Practices</Label>
                <Textarea 
                  id="handlingPractices" 
                  name="handlingPractices" 
                  value={productData.handlingPractices} 
                  onChange={handleChange} 
                  placeholder="Describe how the produce was handled after harvesting" 
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storageConditions">Storage Conditions</Label>
                <Textarea 
                  id="storageConditions" 
                  name="storageConditions" 
                  value={productData.storageConditions} 
                  onChange={handleChange} 
                  placeholder="Describe current storage conditions" 
                  rows={2}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full">Submit Product</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FarmerProductForm;

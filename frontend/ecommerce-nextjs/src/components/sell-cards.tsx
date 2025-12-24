"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React, { useState } from "react";

export function SellCards() {
    const [list, setList] = useState<any[]>([]);
    const [title, setTitle] = useState<string>("");
    const [Description, setDescription] = useState<string>("");
    const [imgUrl, setImgUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle></CardTitle>
                    <CardDescription>Card Description</CardDescription>
                    <CardAction>Card Action</CardAction>
                </CardHeader>
                <CardContent>
                    <p>Card Content</p>
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>
        </div>
    );
}
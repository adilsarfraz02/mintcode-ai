import {useMDXComponents} from "@mdx-js/react";
import React from "react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

export default function MDXContent({ source }) {
    const components = useMDXComponents();

    return (
        <MDXRemote {...source} components={components} />
    );
}
